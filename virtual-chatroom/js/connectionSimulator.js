import { EventEmitter } from './EventEmitter.js';

const CONNECTION_STATES = {
  NEW: 'new',
  CONNECTING: 'connecting',
  CONNECTED: 'connected',
  FAILED: 'failed',
  RECONNECTING: 'reconnecting',
  DISCONNECTED: 'disconnected',
};

class SimulatedPeerConnection extends EventEmitter {
  constructor(participantId, roomState) {
    super();
    this.participantId = participantId;
    this.roomState = roomState;
    this.state = CONNECTION_STATES.NEW;
    this.packetLoss = 0;
    this._timers = [];
    this._packetLossInterval = null;
    this._reconnectAttempts = 0;
    this._maxReconnectAttempts = 3;
    this._destroyed = false;
  }

  connect() {
    if (this._destroyed) return;
    this._setState(CONNECTION_STATES.CONNECTING);
    this._simulateICEGathering();
  }

  _simulateICEGathering() {
    const delay = 1000 + Math.random() * 2000;
    const timer = setTimeout(() => {
      if (this._destroyed) return;
      const willFail = Math.random() < 0.15;
      if (willFail) {
        this._setState(CONNECTION_STATES.FAILED);
        this.emit('connectionFailed', { participantId: this.participantId });
        this._attemptReconnect();
      } else {
        this._setState(CONNECTION_STATES.CONNECTED);
        this.emit('connectionEstablished', { participantId: this.participantId });
        this._startPacketLossSimulation();
      }
    }, delay);
    this._timers.push(timer);
  }

  _attemptReconnect() {
    if (this._destroyed) return;
    if (this._reconnectAttempts >= this._maxReconnectAttempts) {
      this.emit('connectionPermanentFailure', { participantId: this.participantId });
      return;
    }

    this._reconnectAttempts++;
    this._setState(CONNECTION_STATES.RECONNECTING);
    this.emit('reconnecting', { participantId: this.participantId, attempt: this._reconnectAttempts });

    const delay = 1500 + Math.random() * 2000;
    const timer = setTimeout(() => {
      if (this._destroyed) return;
      const willSucceed = Math.random() < 0.7;
      if (willSucceed) {
        this._setState(CONNECTION_STATES.CONNECTED);
        this.emit('connectionEstablished', { participantId: this.participantId });
        this._startPacketLossSimulation();
      } else {
        this._setState(CONNECTION_STATES.FAILED);
        this.emit('connectionFailed', { participantId: this.participantId });
        this._attemptReconnect();
      }
    }, delay);
    this._timers.push(timer);
  }

  simulateDisconnect() {
    if (this._destroyed) return;
    this._stopPacketLossSimulation();
    this._setState(CONNECTION_STATES.DISCONNECTED);
    this.emit('connectionDisconnected', { participantId: this.participantId });
    this._attemptReconnect();
  }

  _startPacketLossSimulation() {
    if (this._destroyed) return;
    this._stopPacketLossSimulation();
    this._packetLossInterval = setInterval(() => {
      if (this._destroyed) return;
      this.packetLoss = Math.random() * 5;
      this.emit('packetLossUpdate', {
        participantId: this.participantId,
        packetLoss: this.packetLoss,
      });
    }, 500 + Math.random() * 1000);
  }

  _stopPacketLossSimulation() {
    if (this._packetLossInterval) {
      clearInterval(this._packetLossInterval);
      this._packetLossInterval = null;
    }
  }

  _setState(newState) {
    const oldState = this.state;
    this.state = newState;
    this.roomState.updateParticipant(this.participantId, { connectionState: newState });
    this.emit('stateChange', { participantId: this.participantId, oldState, newState });
  }

  destroy() {
    this._destroyed = true;
    this._stopPacketLossSimulation();
    for (const t of this._timers) {
      clearTimeout(t);
    }
    this._timers = [];
    this.removeAllListeners();
  }
}

export class ConnectionSimulator extends EventEmitter {
  constructor(roomState) {
    super();
    this.roomState = roomState;
    this._connections = new Map();
    this._addParticipantTimers = [];
    this._globalDisconnectTimer = null;
    this._randomEventTimer = null;

    this._setupRoomListeners();
  }

  _setupRoomListeners() {
    this.roomState.on('roomJoined', () => {
      this._startSimulation();
    });

    this.roomState.on('participantJoined', ({ participant }) => {
      if (!participant.isSelf && participant.connectionState === 'connecting') {
        this._createConnection(participant.id);
      }
    });
  }

  _startSimulation() {
    const selfConn = new SimulatedPeerConnection(this.roomState.selfId, this.roomState);
    this._connections.set(this.roomState.selfId, selfConn);

    selfConn.on('stateChange', ({ oldState, newState }) => {
      this.emit('connectionStateChange', {
        participantId: this.roomState.selfId,
        oldState,
        newState,
      });
    });

    selfConn.connect();

    this._scheduleFakeParticipants();
    this._scheduleRandomNetworkEvents();
  }

  _createConnection(participantId) {
    const conn = new SimulatedPeerConnection(participantId, this.roomState);
    this._connections.set(participantId, conn);

    conn.on('stateChange', ({ oldState, newState }) => {
      this.emit('connectionStateChange', { participantId, oldState, newState });
    });

    conn.on('packetLossUpdate', ({ packetLoss }) => {
      this.emit('packetLossUpdate', { participantId, packetLoss });
    });

    conn.on('connectionPermanentFailure', () => {
      this.emit('connectionPermanentFailure', { participantId });
    });

    conn.connect();
  }

  _scheduleFakeParticipants() {
    const maxAdditional = MAX_PARTICIPANTS - 1;
    const count = 1 + Math.floor(Math.random() * maxAdditional);

    for (let i = 0; i < count; i++) {
      const delay = 2000 + Math.random() * 4000 + i * 2000;
      const timer = setTimeout(() => {
        if (!this.roomState.isInRoom) return;
        if (this.roomState.canAddMore()) {
          this.roomState.addFakeParticipant();
        }
      }, delay);
      this._addParticipantTimers.push(timer);
    }
  }

  _scheduleRandomNetworkEvents() {
    this._randomEventTimer = setInterval(() => {
      if (!this.roomState.isInRoom) return;
      const participants = this.roomState.getAllParticipants();
      const others = participants.filter(p => !p.isSelf && p.connectionState === 'connected');
      if (others.length === 0) return;

      if (Math.random() < 0.08) {
        const target = others[Math.floor(Math.random() * others.length)];
        const conn = this._connections.get(target.id);
        if (conn) {
          conn.simulateDisconnect();
          this.emit('networkInterruption', { participantId: target.id });
        }
      }
    }, 8000);
  }

  simulateGlobalDisconnect() {
    const participants = this.roomState.getAllParticipants();
    for (const p of participants) {
      const conn = this._connections.get(p.id);
      if (conn && conn.state === 'connected') {
        conn.simulateDisconnect();
      }
    }
    this.emit('globalDisconnect');
  }

  getVolumeForParticipant(participantId) {
    const conn = this._connections.get(participantId);
    if (!conn) return 0;
    const participant = this.roomState.getParticipant(participantId);
    if (!participant) return 0;
    if (participant.isMuted) return 0;
    if (participant.connectionState !== 'connected') return 0;
    if (participant.isSpeaking) {
      return 40 + Math.random() * 60;
    }
    return Math.random() * 15;
  }

  destroy() {
    for (const timer of this._addParticipantTimers) {
      clearTimeout(timer);
    }
    this._addParticipantTimers = [];

    if (this._randomEventTimer) {
      clearInterval(this._randomEventTimer);
      this._randomEventTimer = null;
    }

    for (const conn of this._connections.values()) {
      conn.destroy();
    }
    this._connections.clear();
    this.removeAllListeners();
  }
}

export { CONNECTION_STATES, SimulatedPeerConnection };

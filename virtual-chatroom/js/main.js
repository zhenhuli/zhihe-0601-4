import { RoomState } from './roomState.js';
import { ConnectionSimulator } from './connectionSimulator.js';
import { AudioVisualizer } from './audioVisualizer.js';
import { ChatSimulator } from './chatSimulator.js';
import { UIRenderer } from './uiRenderer.js';

class VirtualChatApp {
  constructor() {
    this.roomState = new RoomState();
    this.connectionSimulator = new ConnectionSimulator(this.roomState);
    this.chatSimulator = new ChatSimulator(this.roomState);
    this.uiRenderer = new UIRenderer(this.roomState, this.connectionSimulator, this.chatSimulator);
    this.audioVisualizer = null;
    this._wireHandles = [];
  }

  init() {
    this.uiRenderer.init();
    this._wireEvents();
  }

  _wireEvents() {
    const h1 = this.uiRenderer.on('createRoom', () => {
      this.roomState.createRoom();
      this._onRoomEntered();
    });
    this._wireHandles.push(h1);

    const h2 = this.uiRenderer.on('joinRoom', ({ roomId }) => {
      const success = this.roomState.joinRoom(roomId);
      if (success) {
        this._onRoomEntered();
      }
    });
    this._wireHandles.push(h2);

    const h3 = this.uiRenderer.on('toggleMute', () => {
      const self = this.roomState.getParticipant(this.roomState.selfId);
      if (self) {
        this.roomState.setSelfMuted(!self.isMuted);
      }
    });
    this._wireHandles.push(h3);

    const h4 = this.uiRenderer.on('startSpeaking', () => {
      this.roomState.setSelfSpeaking(true);
    });
    this._wireHandles.push(h4);

    const h5 = this.uiRenderer.on('stopSpeaking', () => {
      this.roomState.setSelfSpeaking(false);
    });
    this._wireHandles.push(h5);

    const h6 = this.uiRenderer.on('reset', () => {
      this._handleReset();
    });
    this._wireHandles.push(h6);

    const h7 = this.uiRenderer.on('simulateDisconnect', () => {
      this.connectionSimulator.simulateGlobalDisconnect();
    });
    this._wireHandles.push(h7);

    const h8 = this.uiRenderer.on('sendChat', ({ content }) => {
      this.chatSimulator.sendSelfMessage(content);
    });
    this._wireHandles.push(h8);

    const h9 = this.uiRenderer.on('startScreenShare', ({ screenId }) => {
      this.roomState.startScreenShare(this.roomState.selfId);
    });
    this._wireHandles.push(h9);

    const h10 = this.uiRenderer.on('stopScreenShare', () => {
      this.roomState.stopScreenShare();
    });
    this._wireHandles.push(h10);
  }

  _onRoomEntered() {
    this.chatSimulator.start();

    const canvas = document.getElementById('audio-canvas');
    this.audioVisualizer = new AudioVisualizer(canvas, this.roomState, this.connectionSimulator);
    this.audioVisualizer.start();
  }

  _handleReset() {
    if (this.audioVisualizer) {
      this.audioVisualizer.destroy();
      this.audioVisualizer = null;
    }
    this.chatSimulator.destroy();
    this.connectionSimulator.destroy();

    this.roomState.leaveRoom();

    this.uiRenderer.destroy();
    this._wireHandles.forEach(unsub => unsub());
    this._wireHandles = [];

    this.connectionSimulator = new ConnectionSimulator(this.roomState);
    this.chatSimulator = new ChatSimulator(this.roomState);
    this.uiRenderer = new UIRenderer(this.roomState, this.connectionSimulator, this.chatSimulator);
    this.uiRenderer.init();
    this._wireEvents();
  }
}

const app = new VirtualChatApp();
app.init();

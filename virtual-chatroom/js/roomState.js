import { EventEmitter } from './EventEmitter.js';

const MAX_PARTICIPANTS = 4;

const FAKE_NAMES = ['小明', '小红', '大壮', '阿花', '老王', '小李', '阿杰', '小雪'];
const FAKE_AVATARS = ['😀', '😎', '🤓', '🧑', '👩', '🧔', '👨‍🦰', '👩‍🦳'];

export class RoomState extends EventEmitter {
  constructor() {
    super();
    this.roomId = null;
    this.participants = new Map();
    this.isInRoom = false;
    this.selfId = null;
    this.screenSharingParticipantId = null;
  }

  createRoom() {
    const id = String(Math.floor(1000 + Math.random() * 9000));
    this.roomId = id;
    this.isInRoom = true;
    this._addSelf();
    this.emit('roomCreated', { roomId: id });
    this.emit('roomJoined', { roomId: id });
    return id;
  }

  joinRoom(roomId) {
    if (!/^\d{4}$/.test(roomId)) {
      this.emit('error', { message: '房间号必须是四位数' });
      return false;
    }
    this.roomId = roomId;
    this.isInRoom = true;
    this._addSelf();
    this.emit('roomJoined', { roomId });
    return true;
  }

  _addSelf() {
    const selfId = 'self-' + Date.now();
    this.selfId = selfId;
    const selfParticipant = {
      id: selfId,
      name: '我',
      avatar: '🎙️',
      isMuted: false,
      isSpeaking: false,
      isSelf: true,
      connectionState: 'connecting',
      packetLoss: 0,
      volume: 0,
      joinedAt: Date.now(),
    };
    this.participants.set(selfId, selfParticipant);
    this.emit('participantJoined', { participant: selfParticipant });
  }

  addFakeParticipant() {
    if (this.participants.size >= MAX_PARTICIPANTS) {
      return null;
    }
    const usedNames = new Set([...this.participants.values()].map(p => p.name));
    const available = FAKE_NAMES.filter(n => !usedNames.has(n));
    if (available.length === 0) return null;

    const name = available[Math.floor(Math.random() * available.length)];
    const avatarIdx = FAKE_NAMES.indexOf(name) % FAKE_AVATARS.length;
    const id = 'peer-' + Date.now() + '-' + Math.random().toString(36).slice(2, 6);

    const participant = {
      id,
      name,
      avatar: FAKE_AVATARS[avatarIdx],
      isMuted: Math.random() > 0.5,
      isSpeaking: false,
      isSelf: false,
      connectionState: 'connecting',
      packetLoss: 0,
      volume: 0,
      joinedAt: Date.now(),
    };

    this.participants.set(id, participant);
    this.emit('participantJoined', { participant });
    return participant;
  }

  removeParticipant(id) {
    const p = this.participants.get(id);
    if (!p) return;
    this.participants.delete(id);
    if (this.screenSharingParticipantId === id) {
      this.screenSharingParticipantId = null;
    }
    this.emit('participantLeft', { participant: p });
  }

  updateParticipant(id, updates) {
    const p = this.participants.get(id);
    if (!p) return;
    Object.assign(p, updates);
    this.emit('participantUpdated', { participant: p, updates });
  }

  setSelfMuted(muted) {
    this.updateParticipant(this.selfId, { isMuted: muted, isSpeaking: false });
  }

  setSelfSpeaking(speaking) {
    const self = this.participants.get(this.selfId);
    if (!self) return;
    if (self.isMuted && speaking) return;
    this.updateParticipant(this.selfId, { isSpeaking: speaking });
  }

  startScreenShare(participantId) {
    this.screenSharingParticipantId = participantId || this.selfId;
    this.emit('screenShareStarted', { participantId: this.screenSharingParticipantId });
  }

  stopScreenShare() {
    const prev = this.screenSharingParticipantId;
    this.screenSharingParticipantId = null;
    this.emit('screenShareStopped', { participantId: prev });
  }

  leaveRoom() {
    this.emit('roomLeaving');
    this.participants.clear();
    this.roomId = null;
    this.isInRoom = false;
    this.selfId = null;
    this.screenSharingParticipantId = null;
    this.emit('roomLeft');
    this.removeAllListeners();
  }

  getParticipant(id) {
    return this.participants.get(id);
  }

  getAllParticipants() {
    return [...this.participants.values()];
  }

  getParticipantCount() {
    return this.participants.size;
  }

  canAddMore() {
    return this.participants.size < MAX_PARTICIPANTS;
  }
}

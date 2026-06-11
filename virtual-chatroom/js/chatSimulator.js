import { EventEmitter } from './EventEmitter.js';

const BOT_MESSAGES = [
  '大家好！',
  '网络好像有点卡？',
  '能听到我说话吗？',
  '今天天气不错',
  '这个功能好酷',
  '我的麦克风好像有问题',
  '等一下，我调一下音量',
  '谁在共享屏幕？',
  '听得很清楚！',
  '延迟好高啊',
  '我这边画面卡了',
  '好的，收到',
  '没问题',
  '稍等，我马上回来',
  '连接断了一下又好了',
];

export class ChatSimulator extends EventEmitter {
  constructor(roomState) {
    super();
    this.roomState = roomState;
    this.messages = [];
    this._botTimer = null;
  }

  start() {
    this._scheduleBotMessages();
  }

  stop() {
    if (this._botTimer) {
      clearTimeout(this._botTimer);
      this._botTimer = null;
    }
  }

  addMessage(senderName, content, isSelf = false) {
    const msg = {
      id: 'msg-' + Date.now() + '-' + Math.random().toString(36).slice(2, 6),
      senderName,
      content,
      isSelf,
      timestamp: new Date(),
    };
    this.messages.push(msg);
    this.emit('newMessage', { message: msg });
    return msg;
  }

  sendSelfMessage(content) {
    if (!content.trim()) return null;
    return this.addMessage('我', content, true);
  }

  _scheduleBotMessages() {
    const schedule = () => {
      if (!this.roomState.isInRoom) return;

      const participants = this.roomState.getAllParticipants().filter(p => !p.isSelf);
      if (participants.length === 0) {
        this._botTimer = setTimeout(schedule, 3000);
        return;
      }

      const delay = 4000 + Math.random() * 12000;

      this._botTimer = setTimeout(() => {
        if (!this.roomState.isInRoom) return;

        const sender = participants[Math.floor(Math.random() * participants.length)];
        const content = BOT_MESSAGES[Math.floor(Math.random() * BOT_MESSAGES.length)];
        this.addMessage(sender.name, content, false);

        schedule();
      }, delay);
    };

    schedule();
  }

  getMessages() {
    return [...this.messages];
  }

  clearMessages() {
    this.messages = [];
    this.emit('messagesCleared');
  }

  destroy() {
    this.stop();
    this.messages = [];
    this.removeAllListeners();
  }
}

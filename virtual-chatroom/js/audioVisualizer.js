import { EventEmitter } from './EventEmitter.js';

const BAR_WIDTH = 4;
const BAR_GAP = 2;
const MAX_BAR_HEIGHT = 100;
const SMOOTHING = 0.3;

export class AudioVisualizer extends EventEmitter {
  constructor(canvas, roomState, connectionSimulator) {
    super();
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.roomState = roomState;
    this.connectionSimulator = connectionSimulator;
    this._animFrameId = null;
    this._barValues = [];
    this._targetValues = [];
    this._running = false;
  }

  start() {
    this._running = true;
    this._animate();
  }

  stop() {
    this._running = false;
    if (this._animFrameId) {
      cancelAnimationFrame(this._animFrameId);
      this._animFrameId = null;
    }
  }

  _animate() {
    if (!this._running) return;

    const participants = this.roomState.getAllParticipants();
    const numBars = Math.max(participants.length * 16, 32);

    while (this._barValues.length < numBars) {
      this._barValues.push(0);
      this._targetValues.push(0);
    }
    while (this._barValues.length > numBars) {
      this._barValues.pop();
      this._targetValues.pop();
    }

    let barIdx = 0;
    for (const p of participants) {
      const volume = this.connectionSimulator.getVolumeForParticipant(p.id);
      for (let i = 0; i < 16; i++) {
        if (barIdx >= numBars) break;
        if (p.connectionState !== 'connected' || p.isMuted) {
          this._targetValues[barIdx] = 0;
        } else {
          const center = 16 / 2;
          const dist = Math.abs(i - center) / center;
          const baseHeight = volume * (1 - dist * 0.6);
          this._targetValues[barIdx] = baseHeight + Math.random() * 10;
        }
        barIdx++;
      }
    }

    for (let i = 0; i < this._barValues.length; i++) {
      this._barValues[i] += (this._targetValues[i] - this._barValues[i]) * SMOOTHING;
      this._barValues[i] = Math.max(0, Math.min(MAX_BAR_HEIGHT, this._barValues[i]));
    }

    this._draw(participants);
    this._animFrameId = requestAnimationFrame(() => this._animate());
  }

  _draw(participants) {
    const { canvas, ctx } = this;
    const dpr = window.devicePixelRatio || 1;

    canvas.width = canvas.clientWidth * dpr;
    canvas.height = canvas.clientHeight * dpr;
    ctx.scale(dpr, dpr);

    const w = canvas.clientWidth;
    const h = canvas.clientHeight;

    ctx.clearRect(0, 0, w, h);

    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, w, h);

    const totalBars = this._barValues.length;
    const totalWidth = totalBars * (BAR_WIDTH + BAR_GAP) - BAR_GAP;
    const startX = (w - totalWidth) / 2;

    const colors = ['#00d2ff', '#7b2ff7', '#ff6b6b', '#ffd93d', '#6bcb77', '#4d96ff'];

    let barIdx = 0;
    for (let pIdx = 0; pIdx < participants.length; pIdx++) {
      const p = participants[pIdx];
      const color = colors[pIdx % colors.length];

      for (let i = 0; i < 16; i++) {
        if (barIdx >= totalBars) break;
        const barHeight = this._barValues[barIdx];
        const x = startX + barIdx * (BAR_WIDTH + BAR_GAP);
        const y = h / 2 - barHeight / 2;

        const gradient = ctx.createLinearGradient(x, y, x, y + barHeight);
        gradient.addColorStop(0, color);
        gradient.addColorStop(1, color + '44');
        ctx.fillStyle = gradient;
        ctx.fillRect(x, y, BAR_WIDTH, barHeight);

        barIdx++;
      }
    }

    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.font = '10px monospace';
    ctx.textAlign = 'center';
    let labelIdx = 0;
    for (const p of participants) {
      const groupX = startX + labelIdx * 16 * (BAR_WIDTH + BAR_GAP) + (16 * (BAR_WIDTH + BAR_GAP)) / 2;
      ctx.fillText(p.name, groupX, h - 4);
      labelIdx++;
    }
  }

  destroy() {
    this.stop();
    this._barValues = [];
    this._targetValues = [];
    this.removeAllListeners();
  }
}

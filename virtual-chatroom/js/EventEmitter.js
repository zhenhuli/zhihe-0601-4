export class EventEmitter {
  constructor() {
    this._listeners = {};
    this._onceListeners = {};
  }

  on(event, callback) {
    if (!this._listeners[event]) {
      this._listeners[event] = [];
    }
    this._listeners[event].push(callback);
    return () => this.off(event, callback);
  }

  once(event, callback) {
    if (!this._onceListeners[event]) {
      this._onceListeners[event] = [];
    }
    this._onceListeners[event].push(callback);
    return () => {
      const idx = this._onceListeners[event].indexOf(callback);
      if (idx !== -1) this._onceListeners[event].splice(idx, 1);
    };
  }

  off(event, callback) {
    if (this._listeners[event]) {
      const idx = this._listeners[event].indexOf(callback);
      if (idx !== -1) this._listeners[event].splice(idx, 1);
    }
    if (this._onceListeners[event]) {
      const idx = this._onceListeners[event].indexOf(callback);
      if (idx !== -1) this._onceListeners[event].splice(idx, 1);
    }
  }

  emit(event, ...args) {
    const listeners = this._listeners[event]?.slice() || [];
    const onceListeners = this._onceListeners[event]?.slice() || [];

    for (const cb of listeners) {
      try { cb(...args); } catch (e) { console.error(`EventEmitter error on "${event}":`, e); }
    }
    for (const cb of onceListeners) {
      try { cb(...args); } catch (e) { console.error(`EventEmitter once error on "${event}":`, e); }
    }

    delete this._onceListeners[event];
  }

  removeAllListeners(event) {
    if (event) {
      delete this._listeners[event];
      delete this._onceListeners[event];
    } else {
      this._listeners = {};
      this._onceListeners = {};
    }
  }

  listenerCount(event) {
    return (this._listeners[event]?.length || 0) + (this._onceListeners[event]?.length || 0);
  }
}

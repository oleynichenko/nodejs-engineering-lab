class EventEmitter {
  constructor() {
    this.events = new Map();
  }

  on(event, listener) {
    const existingListeners = this.events.get(event);

    if (existingListeners) {
      if (existingListeners.includes(listener)) {
        return;
      }

      existingListeners.push(listener);
      return;
    }

    this.events.set(event, [listener]);
  }

  off(event, listener) {
    const existingListeners = this.events.get(event);

    if (!existingListeners) {
      return;
    }

    const updatedListeners = existingListeners.filter(l => l !== listener);

    if (!updatedListeners.length) {
      this.events.delete(event);
      return;
    }

    this.events.set(event, updatedListeners);
  }

  emit(event, ...args) {
    const listeners = this.events.get(event);

    if (!listeners) {
      return;
    }

    listeners.forEach((l) => l(...args));
  }
}

module.exports = { EventEmitter };

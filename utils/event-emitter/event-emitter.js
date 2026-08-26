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

  // off(event, listener) {
  //   if (!this.#has(event)) {
  //     return;
  //   }

  //   const listeners = this.#get(event);

  //   if (!listeners) {
  //     return;
  //   }

  //   const filteredListeners = listeners.filter((l) => l !== listener);
  // }

  emit(event, ...args) {
    const listeners = this.events.get(event);

    if (!listeners) {
      return;
    }

    listeners.forEach((l) => l(...args));
  }
}

module.exports = { EventEmitter };

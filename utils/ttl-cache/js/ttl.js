class TTLCache {
  #cache = new Map();
  #timer = null;

  constructor() {
    this.#timer = setInterval(() => {
      const now = Date.now();

      for (const [key, value] of this.#cache) {
        if (value.expiredAt <= now) {
          this.#cache.delete(key);
        }
      }
    }, 1000);
  }

  set(key, value, ttl) {
    this.#cache.set(key, {
      value,
      expiredAt: ttl + Date.now()
    });
  }

  get(key) {
    const item = this.#cache.get(key);

    if (!item) {
      return undefined;
    }

    if (item.expiredAt <= Date.now()) {
      this.delete(key);
      return undefined;
    }

    return item.value;
  }

  delete(key) {
    // Map.prototype.delete() return true or false
    return this.#cache.delete(key);
  }

  has(key) {
    const item = this.#cache.get(key);

    if (!item || item.expiredAt <= Date.now() ) {
      this.delete(key);
      return false;
    }

    return true;
  }

  // destroy() is used to clean up the timer when the cache is no longer needed.
  // Otherwise, the interval keeps running and can keep the process busy unnecessarily.
  destroy() {
    clearInterval(this.#timer);
    this.#timer = null;
  }

  size() {
    return this.#cache.size;
  }
}

module.exports = TTLCache;

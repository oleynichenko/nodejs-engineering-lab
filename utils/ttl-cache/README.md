# TTL Cache — Interview Task

### Task

Implement a simple **TTL (Time-To-Live) Cache** in Node.js.

Create a `TTLCache` class that stores key-value pairs for a limited amount of time. When an entry's TTL expires, it should no longer be returned by `get()`.

### Requirements

Implement the following methods:

class TTLCache {
constructor() {}

set(key, value, ttl) {}

get(key) {}

delete(key) {}

has(key) {}
}

Where:

- `set(key, value, ttl)` — stores a value for `ttl` milliseconds.
- `get(key)` — returns the value if it exists and has not expired; otherwise returns `undefined`.
- `delete(key)` — removes the entry from the cache.
- `has(key)` — returns `true` if the key exists and has not expired, otherwise `false`.

### Example

const cache = new TTLCache();

cache.set('user:1', { name: 'John' }, 1000);

console.log(cache.get('user:1'));
// { name: 'John' }

setTimeout(() => {
console.log(cache.get('user:1'));
// undefined
}, 1100);

### Additional Requirements

Your implementation should:

1. Correctly handle multiple keys with different TTLs.
2. Reset the TTL when `set()` is called again for an existing key.
3. Remove expired entries so that they do not remain in memory indefinitely.
4. Avoid creating unnecessary timers for every cached item if possible.

### Interview Discussion

After implementing the basic version, be prepared to explain:

- How would you prevent **memory leaks** caused by expired entries?
- What is the time complexity of `get()`, `set()`, and `delete()`?
- Would you use `setTimeout()` for every entry? Why or why not?
- How would you implement **LRU + TTL Cache**?
- How would this cache behave if multiple Node.js processes were running?
- When would you use **Redis** instead of an in-memory TTL cache?

**Bonus:** Implement the cache so that expired entries are cleaned up automatically while keeping the number of active timers bounded.

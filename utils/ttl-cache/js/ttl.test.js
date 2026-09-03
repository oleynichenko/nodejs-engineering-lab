const { describe, it, beforeEach, afterEach } = require("node:test");
const assert = require("node:assert");
const TTLCache = require("./ttl");

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

describe("TTLCache", () => {
  let ttlCache;

  beforeEach(() => {
    ttlCache = new TTLCache();
  });

  afterEach(() => {
    ttlCache.destroy();
  });

  it("should stores a value for ttl milliseconds", async () => {
    const ttl = 100;
    const testKey = "testKey";
    const testValue = "testValue";

    ttlCache.set(testKey, testValue, ttl);

    const cachedValue = ttlCache.get(testKey);
    assert.strictEqual(cachedValue, testValue);

    await delay(ttl + 20);

    const cachedValue1 = ttlCache.get(testKey);

    assert.strictEqual(cachedValue1, undefined);
  });

  it.only("should stop inner cache cleaning with destroy method", () => {
    const ttl = 100;
    const testKey = "testKey";
    const testValue = "testValue";

    ttlCache.set(testKey, testValue, ttl);
    ttlCache.destroy();

    delay(ttl + 50);

    const cacheSize = ttlCache.size();

    assert.strictEqual(cacheSize, 1);
  });
});

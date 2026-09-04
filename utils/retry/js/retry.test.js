const { describe, it, beforeEach } = require("node:test");
const assert = require("node:assert");
const retry = require("./retry");

describe("Retry", () => {
  let testFunc;
  let testFuncCalled = false;

  beforeEach(() => {
    testFunc = () => {
      testFuncCalled = true;
      return "result";
    };
  });

  it.only("should run function on first success attempt", async () => {
    const result = await retry(testFunc, { retries: 1 });

    assert.strictEqual(testFuncCalled, true);
    assert.strictEqual(result, "result");
  });
});

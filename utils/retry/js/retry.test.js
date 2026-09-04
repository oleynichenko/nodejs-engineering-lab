const { describe, it, beforeEach } = require("node:test");
const assert = require("node:assert");
const retry = require("./retry");

describe("Retry", () => {
  it.only("should return result when function succeeds on first attempt", async () => {
    let calls = 0;

    const testFunc = () => {
      calls++;
      return 'success';
    };

    const result = await retry(testFunc, { retries: 1 });

    assert.strictEqual(calls, 1);
    assert.strictEqual(result, "success");
  });

  it("should retry when function fails", async () => {
    let calls = 0;
    const retries = 2;

    const testFunc = () => {
      calls++;

      if (calls === retries) {
        return 'success';
      }

      throw new Error();
    };

    const result = await retry(testFunc, { retries });

    assert.strictEqual(calls, retries + 1);
    assert.strictEqual(result, "success");
  });

  it("should throw immediately when retries is 0", async () => {
    let calls = 0;

    const testFunc = () => {
      calls++;

      if (calls === retries) {
        return 'success';
      }

      throw new Error();
    };

    assert.strictEqual(calls, 0);
  });

  it("should execute the function the expected number of times", async () => {

  });

  it("should throw the last error when all attempts fail", async () => {

  });

  it("should stop retrying after function succeeds", async () => {

  });

  it("should propagate the original error", async () => {

  });
});

const { describe, it } = require("node:test");
const assert = require("node:assert");
const retry = require("./retry");

describe("Retry", () => {
  it("should return result when function succeeds on first attempt", async () => {
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

  // TODO continue
  it.only("should throw immediately when retries is 0", async () => {
    let calls = 0;
    const errorMessage = "An error happened";

    const testFunc = () => {
      calls++;
      throw new Error(errorMessage);
    };

    await assert.rejects(
      retry(testFunc, { retries: 0 }),
      { message: errorMessage }
    );

    assert.equal(calls, 1);
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

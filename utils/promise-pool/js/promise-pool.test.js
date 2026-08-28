const { describe, it } = require("node:test");
const assert = require("node:assert");
const PromisePool = require("./promise-pool");

function delay(value, ms) {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

describe("PromisePool", () => {
  it("returns an array with results in the same order", async () => {
    const promises = [
      () => delay("A", 1000),
      () => delay("B", 100),
      () => delay("C", 200),
      () => delay("D", 3000),
    ];

    const results = await PromisePool(promises, 2);

    assert.deepStrictEqual(results, ["A", "B", "C", "D"]);
  });

  it("return error if one promise fails", async () => {
    const promises = [
      () => delay("A", 1000),
      () => Promise.reject(new Error("An error happened")),
    ];

    await assert.rejects(() => PromisePool(promises, 1), {
      message: "An error happened",
    });
  });

  it.only("throws error if count not greater then 0", async () => {
    const promises = [
      () => delay("A", 1000),
      () => delay("B", 100),
      () => delay("C", 200),
      () => delay("D", 3000),
    ];

    const promise = PromisePool(promises, 0);

    await assert.rejects(promise, {
      message: "count must be greater then 0",
    });
  });
});

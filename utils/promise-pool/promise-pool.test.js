const { describe, it } = require('node:test');
const assert = require("node:assert");
const PromisePool = require('./promise-pool');

function delay(value, ms) {
  return new Promise(resolve => setTimeout(() => resolve(value), ms));
}

describe('PromisePool', () => {
  it.only('Should return an array with results', async () => {
    const promises = [
      () => delay('A', 1000),
      () => delay('B', 100),
    ];

    const results = await PromisePool(promises, 1);

    assert.deepStrictEqual(results, ['A', 'B']);
  });
});

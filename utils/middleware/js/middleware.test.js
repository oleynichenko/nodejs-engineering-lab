const { describe, it } = require('node:test');
const assert = require("node:assert");
const createMiddlewarePipeline = require('./middleware');

describe('middleware', () => {
  it('should execute middleware', () => {
    let called = false;

    const middleware1 = (context, next) => {
      called = true;
    };

    const pipeline = createMiddlewarePipeline([middleware1]);
    pipeline(middleware1);

    assert.equal(called, true);
  });
});

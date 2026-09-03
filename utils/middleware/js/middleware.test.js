const { describe, it } = require("node:test");
const assert = require("node:assert");
const createMiddlewarePipeline = require("./middleware");

describe("middleware", () => {
  it("should execute middleware", () => {
    let called1 = false;
    let called2 = false;

    const middleware1 = (_context, next) => {
      called1 = true;
      next();
    };

    const middleware2 = (_context, next) => {
      called2 = true;
      next();
    };

    const pipeline = createMiddlewarePipeline([middleware1, middleware2]);

    pipeline({});

    assert.deepEqual([called1, called2], [true, true]);
  });

  it("should be able to execute logic both before and after next()", () => {
    let calledBefore = false;
    let calledAfter = false;

    const middleware1 = (_context, next) => {
      calledBefore = true;
      next();
      calledAfter = true;
    };

    const middleware2 = (_context, next) => {
      next();
    };

    const pipeline = createMiddlewarePipeline([middleware1, middleware2]);

    pipeline({});

    assert.deepEqual([calledBefore, calledAfter], [true, true]);
  });

  it("should stop if a middleware does not call next()", () => {
    let called1 = false;
    let called2 = false;

    const middleware1 = (_context, _next) => {
      called1 = true;
    };

    const middleware2 = (_context, next) => {
      called2 = true;
      next();
    };

    const pipeline = createMiddlewarePipeline([middleware1, middleware2]);

    pipeline({});

    assert.deepEqual([called1, called2], [true, false]);
  });
});

describe("pipeline", () => {
  it("should throw the same error if a middleware throws an error", () => {
    const error = new Error("Error 1");

    const middleware1 = (_context, _next) => {
      throw error;
    };

    const pipeline = createMiddlewarePipeline([middleware1]);

    assert.throws(() => pipeline({}), error);
  });
})

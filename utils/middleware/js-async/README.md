# Implement a Middleware Pipeline

Implement a middleware pipeline similar to the one used in web frameworks such as Express.js.

A middleware is a function that receives a `context` object and a `next` function. It can perform some logic before and/or after passing control to the next middleware.

Your task is to implement a function `createMiddlewarePipeline` that accepts an array of middleware functions and returns a function that executes them in the correct order.

## Requirements

* Each middleware receives `(context, next)`.
* Calling `next()` should execute the next middleware in the pipeline.
* Middleware should be able to execute logic **before** and **after** `next()`.
* The pipeline should preserve the order of middleware execution.
* The returned function should return a `Promise`.
* Support both synchronous and asynchronous middleware.
* If a middleware does not call `next()`, execution should stop at that middleware.
* If a middleware throws an error or `next()` rejects, the returned promise should reject with that error.

## Example

```ts
const middleware1 = async (ctx, next) => {
  console.log("middleware 1 before");

  await next();

  console.log("middleware 1 after");
};

const middleware2 = async (ctx, next) => {
  console.log("middleware 2 before");

  await next();

  console.log("middleware 2 after");
};

const middleware3 = async (ctx, next) => {
  console.log("middleware 3");
};

const run = createMiddlewarePipeline([
  middleware1,
  middleware2,
  middleware3,
]);

await run({});

```

Expected output:

```text
middleware 1 before
middleware 2 before
middleware 3
middleware 2 after
middleware 1 after
```

## Function Signature

```ts
type Middleware = (
  context: unknown,
  next: () => Promise<void>
) => unknown | Promise<unknown>;

function createMiddlewarePipeline(
  middlewares: Middleware[]
): (context: unknown) => Promise<void>;
```

## Edge Cases

Consider how your implementation should behave when:

1. The middleware array is empty.
2. A middleware never calls `next()`.
3. A middleware calls `next()` more than once.
4. A middleware throws an error.
5. A middleware is synchronous rather than asynchronous.

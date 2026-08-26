# Implement a Synchronous Middleware Pipeline

Implement a synchronous middleware pipeline similar to the middleware pattern used in web frameworks.

A middleware is a function that receives a `context` object and a `next` function. It can perform some logic before and/or after passing control to the next middleware.

Your task is to implement `createMiddlewarePipeline`, which accepts an array of middleware functions and returns a function that executes them in the correct order.

## Requirements

* Each middleware receives `(context, next)`.
* Calling `next()` should execute the next middleware in the pipeline.
* Middleware should be able to execute logic both **before** and **after** `next()`.
* Middleware must execute in the order in which they were provided.
* The pipeline should be synchronous.
* If a middleware does not call `next()`, execution should stop at that middleware.
* If a middleware throws an error, the pipeline should throw that error.

## Example

```ts
const middleware1 = (ctx, next) => {
  console.log("middleware 1 before");

  next();

  console.log("middleware 1 after");
};

const middleware2 = (ctx, next) => {
  console.log("middleware 2 before");

  next();

  console.log("middleware 2 after");
};

const middleware3 = (ctx, next) => {
  console.log("middleware 3");
};

const run = createMiddlewarePipeline([
  middleware1,
  middleware2,
  middleware3,
]);

run({});
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
  next: () => void
) => void;

function createMiddlewarePipeline(
  middlewares: Middleware[]
): (context: unknown) => void;
```

## Edge Cases

Consider how your implementation should behave when:

1. The middleware array is empty.
2. A middleware does not call `next()`.
3. A middleware calls `next()` more than once.
4. A middleware throws an error.

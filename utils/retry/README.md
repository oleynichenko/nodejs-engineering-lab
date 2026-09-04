# Implement `retry`

Write a function that executes an async task and retries it when it fails.

## Function Signature

```ts
type RetryOptions = {
  retries?: number; // how many times to retry after the first failure (default: 3)
  delay?: number;   // delay before each retry, in ms (default: 0)
};

type Task<T> = () => Promise<T>;

async function retry<T>(fn: Task<T>, options?: RetryOptions): Promise<T> {}
```

## Requirements

* `fn` is a function that returns a `Promise`.
* Call `fn` immediately on the first attempt.
* If `fn` rejects, retry up to `retries` more times.
* Wait `delay` ms before each retry.
* If a call succeeds, return its result.
* If all attempts fail, throw the last error.

## Example

```ts
let attempt = 0;

const result = await retry(
  async () => {
    attempt++;
    if (attempt < 3) throw new Error("fail");
    return "ok";
  },
  { retries: 3, delay: 50 },
);

console.log(result); // "ok"
```

## Edge Cases

* `retries: 0` — only one attempt, no retries.
* `fn` resolves — no retries should happen.
* `fn` always rejects — throw after all attempts are used.

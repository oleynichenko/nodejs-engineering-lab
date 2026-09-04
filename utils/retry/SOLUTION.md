# Retry — Solution & Interview Notes

## Reference Solution

```ts
type RetryOptions = {
  retries?: number;
  delay?: number;
};

type Task<T> = () => Promise<T>;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function retry<T>(
  fn: Task<T>,
  options: RetryOptions = {},
): Promise<T> {
  const { retries = 3, delay = 0 } = options;

  let lastError: unknown;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      if (attempt === retries) {
        break;
      }

      if (delay > 0) {
        await sleep(delay);
      }
    }
  }

  throw lastError;
}
```

### How it works

1. Loop from `0` to `retries` — that is `retries + 1` total attempts.
2. `await fn()` inside `try/catch`.
3. On success, `return` immediately — no more retries.
4. On failure, save the error. If attempts remain, `sleep(delay)` then continue.
5. After the loop, `throw lastError`.

### Common mistakes

| Mistake | Why it is wrong |
|--------|------------------|
| Loop `attempt < retries` without `+1` | One fewer attempt than expected |
| Retry after the last failure | Wastes a call or throws wrong error |
| `setTimeout` without `await` | Next attempt starts before the delay |
| Blocking sleep (`while (Date.now() < t)`) | Blocks the event loop in Node.js |

---

## What to Know for the Interview

### 1. Why retry at all?

Transient failures are normal in backend systems: network blips, DB connection timeouts, downstream 503s. Retries improve reliability **when the operation is safe to repeat**.

### 2. Fixed delay vs exponential backoff

The basic task uses a **fixed delay**. In production you usually want **exponential backoff**:

```
delay = baseDelay * 2^attempt   // e.g. 100ms → 200ms → 400ms → 800ms
```

Why: if a service is overloaded, hammering it with fast retries makes things worse. Backing off gives it time to recover.

Cap the delay with `maxDelay` so you do not wait minutes between attempts.

### 3. Jitter

Many clients failing at the same moment will retry at the same moment → **thundering herd**.

Add randomness:

```ts
const jitteredDelay = Math.random() * delay; // full jitter
```

You do not need to implement this in the basic task, but mentioning it shows senior-level awareness.

### 4. Which errors are retryable?

Not every error should be retried.

| Retry? | Examples |
|--------|----------|
| Yes | Network timeout, ECONNRESET, HTTP 502/503/504, HTTP 429 |
| No | HTTP 400/401/404, validation errors, "user not found" |

Pattern:

```ts
isRetryable: (error: unknown) =>
  error instanceof HttpError &&
  (error.status >= 500 || error.status === 429)
```

If `isRetryable` returns `false` — **fail fast**, do not waste retries.

### 5. Idempotency

Retries are only safe if repeating the operation does not cause duplicate side effects.

- **Safe to retry**: GET, PUT with same payload, reads, idempotent DELETE
- **Risky**: POST that creates a payment, sends an email, charges a card

Production fix: **idempotency keys** — client sends `Idempotency-Key: uuid`, server stores result and returns the same response on duplicate requests.

This is a classic senior follow-up: *"Would you retry a POST?"* → *"Only with idempotency guarantees."*

### 6. Retries vs circuit breaker

Retries help with **short** transient failures.

If a dependency is down for minutes, retrying every client independently still overloads it.

**Circuit breaker**: after N failures, stop calling the service for a cooldown period and fail fast (or return cached/fallback data).

Retries and circuit breakers are complementary, not alternatives.

### 7. Observability

In real systems, log or metric:

- `attempt` number
- `error` type / status code
- `delay` before next retry
- whether retries were exhausted

Helps debug "why was this request slow?" in production.

### 8. Testing async retry code

```ts
import { mock } from "node:test";

mock.timers.enable({ apis: ["setTimeout"] });

// call retry, then mock.timers.tick(delay)
```

Or inject `sleep` as a dependency so tests do not depend on real time.

---

## Typical Interview Progression

Most interviews start with the basic task from `README.md`, then extend verbally:

1. **Basic retry** — loop + try/catch (what you implement first)
2. *"Add a delay between retries"* — `setTimeout` + `Promise`
3. *"Use exponential backoff"* — multiply delay each attempt
4. *"What if the error is not retryable?"* — `isRetryable` predicate
5. *"What about POST requests?"* — idempotency discussion
6. *"How would you test this?"* — fake timers, injectable delay

You rarely get the full spec upfront. The interviewer adds constraints as you go.

---

## Extended Solution (exponential backoff)

If asked to extend the basic version:

```ts
type ExtendedRetryOptions = {
  retries?: number;
  baseDelay?: number;
  maxDelay?: number;
  backoffFactor?: number;
  isRetryable?: (error: unknown) => boolean;
};

export async function retry<T>(
  fn: Task<T>,
  options: ExtendedRetryOptions = {},
): Promise<T> {
  const {
    retries = 3,
    baseDelay = 100,
    maxDelay = 30_000,
    backoffFactor = 2,
    isRetryable = () => true,
  } = options;

  let lastError: unknown;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      if (!isRetryable(error) || attempt === retries) {
        break;
      }

      const delay = Math.min(
        baseDelay * backoffFactor ** attempt,
        maxDelay,
      );

      await sleep(delay);
    }
  }

  throw lastError;
}
```

Note: `attempt` in the delay formula is `0` after the first failure → delay = `baseDelay`, then `baseDelay * 2`, etc.

---

## Quick Checklist Before the Interview

- [ ] Write a `for` loop with `try/catch` and `await fn()`
- [ ] Know why `attempt <= retries` gives `retries + 1` total calls
- [ ] Implement `sleep` with `new Promise(r => setTimeout(r, ms))`
- [ ] Explain exponential backoff and why fixed delay is not enough at scale
- [ ] Know which HTTP status codes to retry
- [ ] Mention idempotency for mutating operations
- [ ] Mention circuit breaker as the next step beyond naive retries

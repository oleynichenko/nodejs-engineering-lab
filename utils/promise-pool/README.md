# Interview Task: Implement a Promise Pool

Implement a function `promisePool` that accepts an array of asynchronous tasks and a concurrency limit.

The function should execute the tasks while ensuring that **no more than `limit` tasks are running at the same time**.

The function should return a Promise that resolves with an array containing the results of all tasks **in the same order as the input tasks**.

If any task rejects, the returned Promise should reject with the same error.

## Function Signature

```ts
type Task<T> = () => Promise<T>;

async function promisePool<T>(
  tasks: Task<T>[],
  limit: number,
): Promise<T[]> {
  // implement
}
```

## Example

```ts
const tasks = [
  () => delay(1000, "A"),
  () => delay(500, "B"),
  () => delay(300, "C"),
  () => delay(700, "D"),
];

const result = await promisePool(tasks, 2);

console.log(result);
// ["A", "B", "C", "D"]
```

At any point, **at most 2 tasks may be running concurrently**.

## What Is Usually Being Tested

* **Concurrency limit** — no more than `limit` tasks should run at the same time.
* **Order** — the results should be returned in the same order as the input tasks.
* **Error handling** — if one task fails, the entire pool should reject with that error.
* **No unnecessary waiting** — when one task finishes, the next task should start immediately instead of waiting for the other tasks to finish.

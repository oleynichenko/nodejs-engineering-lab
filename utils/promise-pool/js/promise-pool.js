async function PromisePool(promises, count = 1) {
  if (!count) {
    throw new Error("count must be greater then 0");
  }

  const promisesCount = promises.length;
  const result = new Array(promisesCount);

  let currentIndex = 0;

  const worker = async () => {
    while (currentIndex < promisesCount) {
      const index = currentIndex++;
      result[index] = await promises[index]();
    }
  };

  const workers = Array.from(
    { length: Math.min(promisesCount, count) },
    worker,
  );

  await Promise.all(workers);

  return result;
}

module.exports = PromisePool;

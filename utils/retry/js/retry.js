const wait = (ms) => new Promise((resolve) => setTimeout(() => resolve(), ms));

async function retry(fn, { retries = 3, delay = 0 }) {
  try {
    return await fn();
  } catch (err) {
    if (retries === 0) {
      throw err;
    }

    await wait(delay);

    return retry(fn, { retries: retries - 1, delay });
  }
}

module.exports = retry;

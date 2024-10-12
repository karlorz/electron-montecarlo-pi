/* global globalThis */
globalThis.onmessage = function handleMessage(e) {
  const { iters } = e.data;
  let count = 0;
  for (let i = 0; i < iters; i += 1) {
    const x = Math.random();
    const y = Math.random();
    if (x * x + y * y <= 1) {
      count += 1;
    }
  }
  globalThis.postMessage(count);
};

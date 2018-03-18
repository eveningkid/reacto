export function later(delay, callback) {
  return new Promise((resolve) => {
    setTimeout(resolve, delay);
  }).then(callback);
}

export function cooler(callback) {
  return Promise.resolve().then(callback);
}

export const perf = {
  cooler,
  later,
};

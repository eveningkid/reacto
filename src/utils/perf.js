export function later(delay, callback) {
  return new Promise(resolve => {
    setTimeout(resolve, delay);
  }).then(callback);
}

export function cooler(callback) {
  return Promise.resolve().then(callback);
}

export function debounce(func, wait, immediate) {
  let timeout;
  return function() {
    const context = this,
      args = arguments;
    const later = function() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
}

export const perf = {
  cooler,
  debounce,
  later,
};

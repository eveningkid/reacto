import excludedKeys from './excluded-keys';

/**
 * Useful to know whether autocomplete should be displayed or not.
 * For example, if the user hit the "," key, autocomplete shouldn't open up.
 */
function isExcludedKey(event) {
  return excludedKeys[(event.keyCode || event.which).toString()];
}

class History {
  constructor(maxLength = 10) {
    this.maxLength = maxLength;
    this.history = [];
  }

  push(token) {
    if (this.history.length === this.maxLength) {
      this.history.shift();
    }

    this.history.push(token);
  }

  getAll() {
    return this.history;
  }
}

/**
 * Indicate whether the history contains an 'import ... from' call
 *
 * @param {History} history
 * @return {boolean}
 */
function historyIsImport(history) {
  const latestTokens = history.getAll().slice(-2);

  for (const token of latestTokens) {
    if (token.string === 'from') {
      return true;
    }
  }

  return false;
}

/**
 * Indicate if the given line is a module import/export call
 *
 * @param {string} line
 * @return {boolean}
 */
function hintIsImport(line) {
  return (
    line.includes('import') ||
    line.includes('export') ||
    line.includes('require')
  );
}

const history = {
  isImport: historyIsImport,
};

export const hint = {
  isExcludedKey,
  isImport: hintIsImport,

  history,
  History,
};

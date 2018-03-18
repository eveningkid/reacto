export default class Suggestion {
  constructor(options = {}) {
    this.text = options.text || '';
    this.displayText = options.displayText || '';
    this.render = options.render || undefined;

    // Extra information e.g dirname, line/col reference, version...
    this.metadata = options.metadata || null;
  }
}

/**
 * Ask something from the user, easily.
 */
class PromptUserManager {
  static callbacks = [];

  /**
   * @param {function} callback (question: object, afterQuestionCallback: function)
   *                            question: { question: string, inputPlaceholder: string }
   */
  static onQuestion(callback) {
    this.callbacks.push(callback);
  }

  static ask(question, afterQuestionCallback) {
    for (const callback of this.callbacks) {
      callback(question, afterQuestionCallback);
    }
  }
}

export default PromptUserManager;

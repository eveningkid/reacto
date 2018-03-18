import { dispatch, getState } from '@rematch/core';

/**
 * A commit takes code operations as an input, and will iterate over them
 * to generate a new result after going through the transformations.
 */
class Commit {
  constructor(...codeOperations) {
    this.codeOperations = [...codeOperations];
  }

  addCodeOperation(codeOperation) {
    this.codeOperations.push(codeOperation);
    return this;
  }

  getCurrentSessionCode() {
    return getState().session.currentSession.code;
  }

  run() {
    let generatedCode = this.getCurrentSessionCode();

    for (const codeOperation of this.codeOperations) {
      generatedCode = codeOperation.using(generatedCode).compute();
    }

    if (this.getCurrentSessionCode() !== generatedCode) {
      dispatch.session.updateGeneratedCode({ generatedCode });
    }
  }
}

export default Commit;

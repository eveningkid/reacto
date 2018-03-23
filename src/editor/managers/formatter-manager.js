import { dispatch } from '@rematch/core';
import { PrettierFormatter } from '../../tools/formatters';
import config from '../../config';

class FormatterManager {
  static formatter = new PrettierFormatter();

  static format = async () => {
    try {
      const generatedCode = await FormatterManager.formatter.format();
      dispatch.session.updateGeneratedCode({ generatedCode });
    } catch (error) {
      console.warn('[Error] Formatter: Could not parse code.');
    }
  }

  static tryFormatOnSave = async () => {
    if (!config().formatter.formatOnSave) return;
    await FormatterManager.format();
  }
}

export default FormatterManager;

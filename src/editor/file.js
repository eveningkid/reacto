import { ApplicationManager } from './managers';
const path = window.require('path');

/**
 * Represent a file instance.
 */
export default class File {
  constructor(
    filePath = '',
    status = {
      temporary: false,
      unsavedChanges: false,
    }
  ) {
    this.filePath = filePath;
    this.status = status;
  }

  filePathWithoutCWD() {
    const cwd = ApplicationManager.environment.getCWD();
    return this.filePath.replace(cwd, '').substr(1);
  }

  basename() {
    return path.basename(this.filePath);
  }

  setHasUnsavedChanges() {
    this.status.unsavedChanges = true;
  }

  setHasNoUnsavedChanges() {
    this.status.unsavedChanges = false;
  }

  hasUnsavedChanges() {
    return this.status.unsavedChanges;
  }

  setIsNotTemporary() {
    this.status.temporary = false;
  }

  setIsTemporary() {
    this.status.temporary = true;
  }

  isTemporary() {
    return this.status.temporary;
  }
}

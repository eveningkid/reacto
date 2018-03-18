/**
 * Represent a file instance.
 */
export default class File {
  constructor(filePath = '', status = { hasUnsavedChanges: false }) {
    this.filePath = filePath;
    this.status = status;
  }

  setHasUnsavedChanges() {
    this.status.hasUnsavedChanges = true;
  }

  setHasNoUnsavedChanges() {
    this.status.hasUnsavedChanges = false;
  }

  hasUnsavedChanges() {
    return this.status.hasUnsavedChanges;
  }
}

import { ApplicationManager } from '../../../editor/managers';

export default class Recipe {
  constructor() {
    this.name = 'Unknown';
    this.description = 'No description.';
    this.progressCallback = () => {};

    this.install = this.install.bind(this);
    this.steps = this.steps.bind(this);
    this.didInstall = this.didInstall.bind(this);
  }

  async install() {
    const steps = this.steps(ApplicationManager);

    for (let i = 0; i < steps.length; i++) {
      const step = steps[i];
      const progress = i / steps.length;
      this.progressCallback(step, progress);
      await new Promise((resolve, reject) => step.todo(resolve, reject));
    }

    this.progressCallback(null, -1);
  }

  /**
   * Set progress callback. Called after each step is achieved
   *
   * @param {function} callback
   */
  onProgress(callback) {
    this.progressCallback = callback;
  }

  /**
   * Define all the steps to be followed to initialize all we need
   * for the recipe
   *
   * @return {Array[Step]}
   */
  steps() {
    return [];
  }

  /**
   * Called right after .install is finished.
   * Should return a string indicating what's the next step to the user.
   * e.g "XX is now installed! Start the xx script to run the server"
   *
   * @return {string}
   */
  didInstall() {
    return '';
  }

  /**
   * Check whether it's necessary to install the recipe.
   * Return a boolean indicating if the recipe is relevant
   *
   * @param {ApplicationManager} application
   * @return {Promise}
   */
  async isInstalled(/*application*/) {
    return false;
  }
}

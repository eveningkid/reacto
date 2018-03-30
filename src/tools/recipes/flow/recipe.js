import Recipe from '../_base/recipe';

class FlowRecipe extends Recipe {
  constructor() {
    super();
    this.name = 'Flow';
    this.description = 'Add Flow type checker.';
  }

  steps({ project }) {
    return [
      {
        label: 'Installing Flow',
        async todo(resolve) {
          const hasFlowDependency = await project.packageManager.isInstalled(
            'flow-bin'
          );

          if (!hasFlowDependency) {
            await project.packageManager.add('flow-bin');
          }

          resolve();
        },
      },
    ];
  }

  didInstall() {
    return `Run the 'flow' script to get started.`;
  }

  async isInstalled({ project }) {
    return await project.packageManager.isInstalled('flow-bin');
  }
}

export default new FlowRecipe();

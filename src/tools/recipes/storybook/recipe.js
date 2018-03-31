import Recipe from '../_base/recipe';

class StoryBookRecipe extends Recipe {
  constructor() {
    super();
    this.name = 'StoryBook';
    this.description = 'Add StoryBook to your application.';
  }

  steps({ environment, project }) {
    return [
      {
        label: 'Installing Storybook CLI',
        async todo(resolve) {
          const isStoryBookInstalled = await environment.hasCommand(
            'getstorybook'
          );

          if (!isStoryBookInstalled) {
            if (project.packageManager) {
              await project.packageManager.add('@storybook/cli', {
                isGlobal: true,
              });
            }
          }

          resolve();
        },
      },
      {
        label: 'Initialize Storybook for project',
        async todo(resolve) {
          await environment.run('getstorybook');
          resolve();
        },
      },
    ];
  }

  didInstall() {
    return `Run the 'storybook' script to get started.`;
  }

  // TODO
  // Find local .storybook folder inside current file tree
  async isInstalled(/*{ environment }*/) {
    return false;
  }
}

export default new StoryBookRecipe();

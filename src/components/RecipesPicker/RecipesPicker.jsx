import React from 'react';
import {
  ApplicationManager,
  ParentProcessManager,
} from '../../editor/managers';
import { ToolbarButton } from '../_ui';
import { selectRecipeMenu } from '../../menus';
import * as recipes from '../../tools/recipes';
import './RecipesPicker.css';

const availableRecipes = Object.values(recipes);

/**
 * Allow the user to run a recipe or know its current status.
 */
class RecipesPicker extends React.Component {
  state = {
    hasCheckedRecipes: false,
    recipesStatus: {},
    loaded: null,
  };

  componentDidMount() {
    setTimeout(() => {
      this.checkAlreadyInstalledRecipes();
      this.setState({ hasCheckedRecipes: true });
    }, 10000);
  }

  /**
   * Check which recipes are already installed
   */
  checkAlreadyInstalledRecipes = async () => {
    let recipesStatus = this.state.recipesStatus;

    for (const recipe of availableRecipes) {
      if (await recipe.isInstalled(ApplicationManager)) {
        recipesStatus[recipe.name] = {
          ...recipesStatus[recipe.name],
          isInstalled: true,
        };
      }
    }

    this.setState({ recipesStatus });
  };

  installRecipe = recipe => {
    recipe.onProgress((step, progress) => {
      let recipesStatus = this.state.recipesStatus;

      if (progress >= 0 && progress <= 1) {
        // In progress
        recipesStatus[recipe.name] = { progress, finished: false, step };
        this.setState({ loaded: progress * 100, recipesStatus });
      } else if (progress === -1) {
        // Finished
        recipesStatus[recipe.name] = { progress, finished: true, step };
        this.setState({ loaded: 100, recipesStatus });
        setTimeout(() => this.setState({ loaded: null }), 1000);
      }

      ParentProcessManager.send(
        ParentProcessManager.actions.UPDATE_PROGRESS_BAR,
        progress
      );
    });

    recipe.install();
  };

  prepareRecipes = allRecipes => {
    const recipesStatus = this.state.recipesStatus;
    return allRecipes.map(recipe => {
      let canInstall = false;
      let isInstalled = false;
      let isInstalling = false;
      let onClick = undefined;

      if (recipesStatus.hasOwnProperty(recipe.name)) {
        // i.e the recipe is in progress or has been installed
        const currentStatus = recipesStatus[recipe.name];
        if (currentStatus.finished || currentStatus.isInstalled) {
          isInstalled = true;
        } else {
          isInstalling = true;
        }
      } else {
        // Can be installed
        canInstall = true;
        onClick = this.installRecipe.bind(this, recipe);
      }

      return {
        ...recipe,
        canInstall,
        isInstalled,
        isInstalling,
        onClick,
      };
    });
  };

  render() {
    return (
      <ToolbarButton
        onClick={element => {
          selectRecipeMenu.open(
            {
              availableRecipes: this.prepareRecipes(availableRecipes),
            },
            {
              x: element.offsetLeft,
              y: element.parentElement.offsetHeight,
            }
          );
        }}
        loaded={this.state.loaded}
      >
        Bootstrap
      </ToolbarButton>
    );
  }
}

export default RecipesPicker;

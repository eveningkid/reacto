import React from 'react';
import classNames from 'classnames';
import key from 'uniqid';
import { Popover } from 'antd';
import { ApplicationManager, ParentProcessManager } from '../../editor/managers';
import * as recipes from '../../tools/recipes';
import './RecipesPicker.css';

const availableRecipes = Object.values(recipes);

/**
 * Allow the user to run a recipe or know its current status.
 */
class RecipesPicker extends React.Component {
  state = {
    isOpened: false,
    recipesStatus: {},
  };

  handleIsOpened = (isOpened) => {
    let hasCheckedRecipes = this.state.hasCheckedRecipes;

    if (!hasCheckedRecipes) {
      this.checkAlreadyInstalledRecipes();
      hasCheckedRecipes = true;
    }

    this.setState({ hasCheckedRecipes, isOpened });
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
          finished: true,
        };
      }
    }

    this.setState({ recipesStatus });
  }

  installRecipe = (recipe) => {
    recipe.onProgress((step, progress) => {
      let recipesStatus = this.state.recipesStatus;

      if (progress >= 0 && progress <= 1) {
        // In progress
        recipesStatus[recipe.name] = { finished: false, step };
      } else if (progress === -1) {
        // Finished
        recipesStatus[recipe.name] = { finished: true, step };
      }

      this.setState({ recipesStatus });

      ParentProcessManager.send(
        ParentProcessManager.actions.UPDATE_PROGRESS_BAR,
        progress
      );
    });

    recipe.install();
  }

  renderRecipe = (recipe) => {
    const recipesStatus = this.state.recipesStatus;
    let canInstall = false;
    let isInstalled = false;
    let title;
    let description;
    let onClick;

    if (recipesStatus.hasOwnProperty(recipe.name)) {
      // i.e the recipe is in progress or has been installed
      const currentStatus = recipesStatus[recipe.name];

      if (currentStatus.finished) {
        isInstalled = true;
        title = recipe.name;
        description = recipe.didInstall();
      } else {
        title = 'Installing ' + recipe.name;
        description = currentStatus.step.label;
      }

      onClick = undefined;
    } else {
      // Can be installed
      canInstall = true;
      title = recipe.name;
      description = recipe.description;
      onClick = this.installRecipe.bind(this, recipe);
    }

    const classes = classNames('recipe', {
      'can-install': canInstall,
      'is-installed': isInstalled,
    });

    return (
      <div
        key={key()}
        className={classes}
        onClick={onClick}
      >
        <div className="name">{title}</div>
        <div className="description">{description}</div>
      </div>
    );
  }

  renderPopover() {
    return (
      <React.Fragment>
        <h1>Bootstrap your application</h1>
        {availableRecipes.map(this.renderRecipe)}
      </React.Fragment>
    );
  }

  render() {
    return (
      <div>
        <Popover
          overlayClassName="RecipesPicker"
          placement="bottom"
          content={this.renderPopover()}
          trigger="click"
          onVisibleChange={this.handleIsOpened}
        >
          Recipes
        </Popover>
      </div>
    );
  }
}

export default RecipesPicker;

import BaseMenu from './_base-menu';

/**
 * Context menu when adding a recipe.
 */
function template({ availableRecipes }) {
  return availableRecipes.map(recipe => {
    let label;
    if (recipe.isInstalled) {
      label = recipe.name;
    } else if (recipe.isInstalling) {
      label = `Adding ${recipe.name}...`;
    } else {
      label = `Add ${recipe.name}`;
    }

    return {
      label,
      type: 'checkbox',
      checked: recipe.isInstalled,
      enabled: !recipe.isInstalling && !recipe.isInstalled,
      click() {
        if (recipe.onClick) recipe.onClick();
      },
    };
  });
}

export default new BaseMenu(template);

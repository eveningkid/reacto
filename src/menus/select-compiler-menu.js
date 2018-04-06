import { dispatch } from '@rematch/core';
import BaseMenu from './_base-menu';

/**
 * Context menu when selecting compiler.
 */
function template({ compiler, options }) {
  return options.map(option => {
    const isSelected = option.value === compiler;
    return {
      label: option.label,
      type: 'checkbox',
      checked: isSelected,
      enabled: !isSelected,
      click() {
        dispatch.project.updateCompiler({ compiler: option.value });
      },
    };
  });
}

export default new BaseMenu(template);

# Tools
Reacto aims to integrate as many tools as possible, to facilitate any developer's workflow.  
**Always think about your own experience: what way would be easier for you and everyone else to use this tool?**

## Status
- **Bundlers**
  - Integrated: None
  - Ideas to be integrated: `parcel`, `rollup`, `webpack`. Think of a "one button" to automatically bundle your app. Visually see which plugins are being used with the currently used bundler.
- **Compilers**
  - Integrated: None
  - Ideas to be integrated: `flow`, `typescript`. Easily compile your code.
- **Component Preview**
  - Integrated: React Component class.
  - Ideas to be integrated: wrapped components, function/variable components. Check `./component-preview/component-preview.js`.
- **Linters**
  - Integrated: `flow`
  - Ideas to be integrated: `eslint`.
- **Navigation:** visually see the router's implementation. Maybe create a route manager.
- **Package Manager**: Integrated: `npm`, `yarn`.
- **Recipes**
  - Integrated: `flow`, `storybook`.
  - Idea: recipes are meant to easily integrate a library into a React project. Think of any similar process that you consider too long, that you want to simplify.
- **Task Runner**: is this really necessary? If so, there is already a `npm` integration that surely needs more work to be useful. Works when paired with the `TaskRunner` component (can be found in `components/TaskRunner`).
- **Testing**:
  - Integrated: None
  - Ideas to be integrated: `ava`, `jest`, `mocha`. Dynamically run local tests and get feedback inside the editor.

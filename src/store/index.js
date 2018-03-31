import { init } from '@rematch/core';
import createRematchPersist from '@rematch/persist';
import * as models from './models';

/**
 * Allow information to be locally saved for next sessions.
 * More information about `redux-persist` configuration:
 * @see https://github.com/rt2zz/redux-persist/blob/master/docs/api.md#type-persistconfig
 */
const persistPlugin = createRematchPersist({
  whitelist: ['history', 'ui'],
});

/**
 * This project uses Rematch, built upon Redux.
 * If you're into Redux and don't like creating `actions` all the time,
 * give it a try. I really like it much more.
 * @see https://github.com/rematch/rematch
 */
export const store = init({
  models,
  plugins: [persistPlugin],
});

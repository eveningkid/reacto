import assign from 'assign-deep';

export default class State {
  constructor(state = {}) {
    this.state = state;
  }

  get = propName => {
    return this.state[propName];
  };

  remove = propName => {
    delete this.state[propName];
  };

  merge = newState => {
    return assign(this.state, newState);
  };
}

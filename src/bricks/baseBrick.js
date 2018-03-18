import State from './state';

class Brick {
  constructor(id) {
    this.id = id;
    this.state = {};
    this.code = '';
  }

  prepareToEvaluate(code, tree, store) {
    this.code = code;
    this.tree = tree;
    this.parsed = tree;
    this.store = store;
    this.evaluate(code, tree, store);
  }

  evaluate(code, tree, store) {}

  setState = (partialState = {}) => {
    const currentState = new State(this.state);
    this.state = currentState.merge(partialState);

    this.brickWillUpdate();

    if (this.parentRenderer) {
      this.parentRenderer.forceUpdate();
    }

    this.didUpdate();
  }

  rendererProps = () => this.state;

  didUpdate() {}
  brickWillEnable() {}
  brickWillUnable() {}
  brickWillUpdate() {}
}

export default Brick;

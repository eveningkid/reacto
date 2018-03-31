import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { InputSearch } from '../_ui';
import { EventsManager } from '../../editor/managers';
import availableBricks from '../../bricks';
import './BrickSelector.css';

class BrickSelector extends React.Component {
  static propTypes = {
    addBrick: PropTypes.func,
  };

  state = { search: '' };

  componentWillMount() {
    this.moduleSuggestions = Object.keys(availableBricks);
    EventsManager.on('focus-brick-selector', () => this.focusSelector());
  }

  focusSelector = () => {
    this.setState({ forceAutoFocus: true }, () => {
      setTimeout(() => {
        this.setState({ forceAutoFocus: false });
      }, 500);
    });
  };

  onAddBrick = brickName => {
    if (this.moduleSuggestions.includes(brickName)) {
      this.props.addBrick(brickName);
      this.setState({ search: '' });
    }
  };

  onChange = search => {
    this.setState({ search });
  };

  render() {
    return (
      <div className="BrickSelector">
        <InputSearch
          suggestions={this.moduleSuggestions}
          placeholder="Add Component (⌘⇧F)"
          onChange={this.onChange}
          onSearch={this.onAddBrick}
          value={this.state.search}
          autoFocus={this.state.forceAutoFocus}
        />
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  addBrick: brickName => dispatch.session.addBrickAsync({ brickName }),
});

export default connect(null, mapDispatchToProps)(BrickSelector);

import React from 'react';
import PropTypes from 'prop-types';
import BinderBrick from './brick';
import key from 'uniqid';
import { Container, List, Select, Text } from '../../components/_ui';

const noMethodsMessage = <Text light>No class methods found.</Text>;

class BinderRenderer extends React.Component {
  static propTypes = {
    parent: PropTypes.object,
    state: PropTypes.object,
  };

  onIsBindedChange = method => {
    this.props.parent.toggleBindMethod(method);
  };

  onBindMethodChange = bindMethod => {
    this.props.parent.bindMethodChange(bindMethod);
  };

  renderBindMethod = ([bindMethodName, value]) => {
    return (
      <Select.Option key={key()} value={value}>
        Using {bindMethodName}
      </Select.Option>
    );
  };

  renderMethod = method => {
    const canToggleIsBinded = !method.isArrowFunction;

    return (
      <List.Entry
        key={key()}
        disabled={!canToggleIsBinded}
        checked={method.isBinded}
        onCheck={this.onIsBindedChange.bind(this, method)}
      >
        <p>{method.name}</p>
      </List.Entry>
    );
  };

  render() {
    return (
      <React.Fragment>
        <Container>
          <List.Entry>
            <p>Binding</p>

            <Select
              value={this.props.state.bindMethod}
              onChange={this.onBindMethodChange}
            >
              {Object.entries(BinderBrick.bindMethods).map(
                this.renderBindMethod
              )}
            </Select>
          </List.Entry>
        </Container>

        <Container>
          <h1>Methods</h1>
          <List noItems={noMethodsMessage}>
            {this.props.state.methods.map(this.renderMethod)}
          </List>
        </Container>
      </React.Fragment>
    );
  }
}

export default BinderRenderer;

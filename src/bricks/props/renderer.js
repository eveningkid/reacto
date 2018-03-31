import React from 'react';
import PropTypes from 'prop-types';
import key from 'uniqid';
import { Icon } from 'antd';
import {
  Alert,
  Button,
  Container,
  Input,
  List,
  Select,
  Text,
} from '../../components/_ui';

const noPropMessage = <Text light>No props found.</Text>;

class PropsRenderer extends React.Component {
  static propTypes = {
    parent: PropTypes.object,
    state: PropTypes.object,
  };

  onIsRequiredChange = (propName, checked) => {
    this.props.parent.updateProp(propName, 'isRequired', checked);
  };

  onTypeChange = (propName, value) => {
    this.props.parent.updateProp(propName, 'type', value);
  };

  onNameChange = (propName, event) => {
    this.props.parent.updateProp(propName, 'name', event.target.value);
  };

  onDefaultChange = (propName, event) => {
    this.props.parent.updateProp(propName, 'default', event.target.value);
  };

  addEmptyProp = () => {
    this.props.parent.addEmptyProp();
  };

  onRemoveProp = propName => {
    this.props.parent.removeProp(propName);
  };

  onImportPropTypes = () => {
    this.props.parent.importPropTypes();
  };

  renderProp = prop => {
    return (
      <List.Entry
        key={key()}
        onCheck={this.onIsRequiredChange.bind(
          this,
          prop.name,
          !prop.isRequired
        )}
        checked={prop.isRequired || false}
      >
        <Icon
          type="close-circle-o"
          onClick={this.onRemoveProp.bind(this, prop.name)}
        />

        <Select
          value={prop.type}
          onChange={this.onTypeChange.bind(this, prop.name)}
        >
          <Select.Option value="array">Array</Select.Option>
          <Select.Option value="bool">Bool</Select.Option>
          <Select.Option value="func">Func</Select.Option>
          <Select.Option value="number">Number</Select.Option>
          <Select.Option value="object">Object</Select.Option>
          <Select.Option value="string">String</Select.Option>
          <Select.Option value="symbol">Symbol</Select.Option>
          <Select.Option value="node">Node</Select.Option>
          <Select.Option value="element">React Element</Select.Option>
          {/* TODO: add other types such as "oneOfType"  */}
        </Select>

        <Input
          placeholder="Name"
          defaultValue={prop.name}
          onPressEnter={this.onNameChange.bind(this, prop.name)}
        />
      </List.Entry>
    );
  };

  render() {
    // TODO: if !state.isFlowCompiler: add "Use 'static' for propTypes" option
    // TODO: add "Use 'static' for defaults" option
    return (
      <React.Fragment>
        {!this.props.state.isFlowCompiler &&
          !this.props.state.hasPropTypesImport && (
            <Alert
              warning
              onClick={this.onImportPropTypes}
              actionText="Fix"
              style={{ marginBottom: 10 }}
            >
              <kbd>prop-types</kbd> must be imported
            </Alert>
          )}

        <Button onClick={this.addEmptyProp} style={{ marginBottom: 10 }}>
          Add Prop
        </Button>

        <Container>
          <h1>Component Props</h1>

          <List noItems={noPropMessage}>
            {Object.values(this.props.state.props).map(this.renderProp)}
          </List>
        </Container>
      </React.Fragment>
    );
  }
}

export default PropsRenderer;

import React from 'react';
import key from 'uniqid';
import { Icon } from 'antd';
import { Container, List, Text } from '../../components/_ui';

const noComponentsMessage = <Text light>No component found.</Text>;

class ComponentTypeRenderer extends React.Component {
  onTransformToPureComponent = (componentName) => {
    this.props.parent.transformToPureComponent(componentName);
  }

  onTransformToComposite = (componentName) => {
    this.props.parent.transformToComposite(componentName);
  }

  renderComponent = (component) => {
    let onClick;
    let title;

    if (component.type === 'class') {
      onClick = this.onTransformToPureComponent.bind(this, component.name);
      title = 'Transform to Pure Component `function ...(props)`';
    } else {
      onClick = this.onTransformToComposite.bind(this, component.name);
      title = 'Transform to Composite `class ... extends`';
    }

    return (
      <List.Entry key={key()}>
        <p>{component.name} — {component.type}</p>
        <Icon type="right-circle-o" onClick={onClick} title={title} />
      </List.Entry>
    );
  }

  render() {
    return (
      <React.Fragment>
        <Container>
          <h1>React Components</h1>
          <List noItems={noComponentsMessage}>
            {this.props.state.components
              .sort((a, b) => a.name > b.name)
              .map(this.renderComponent)
            }
          </List>
        </Container>
      </React.Fragment>
    );
  }
}

export default ComponentTypeRenderer;

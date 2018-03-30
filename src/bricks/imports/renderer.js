import React from 'react';
import key from 'uniqid';
import { Icon } from 'antd';
import { Container, List, Text } from '../../components/_ui';

const noImportsMessage = {
  available: <Text light>No imports found.</Text>,
  restore: <Text light>No imports to restore.</Text>,
};

class ImportsRenderer extends React.Component {
  onDeleteImport = imported => {
    this.props.parent.deleteImport(imported);
  };

  onRestoreImport = imported => {
    this.props.parent.restoreImport(imported);
  };

  // IDEA: drag n drop imports order

  renderImport = (action, imported) => {
    let onClick;
    let type;

    if (action === 'delete') {
      type = 'close-circle-o';
      onClick = this.onDeleteImport.bind(this, imported);
    } else {
      type = 'plus-circle-o';
      onClick = this.onRestoreImport.bind(this, imported);
    }

    return (
      <List.Entry key={key()}>
        <p>{imported.name}</p>
        <Icon type={type} onClick={onClick} />
      </List.Entry>
    );
  };

  render() {
    return (
      <React.Fragment>
        <Container>
          <h1>File Imports</h1>
          <List noItems={noImportsMessage.available}>
            {this.props.state.imports.map(
              this.renderImport.bind(this, 'delete')
            )}
          </List>
        </Container>

        <Container>
          <h1>Restore Imports</h1>
          <List noItems={noImportsMessage.restore}>
            {this.props.state.deletedImports.map(
              this.renderImport.bind(this, 'restore')
            )}
          </List>
        </Container>
      </React.Fragment>
    );
  }
}

export default ImportsRenderer;

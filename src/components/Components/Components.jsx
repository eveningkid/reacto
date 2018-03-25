import React from 'react';
import key from 'uniqid';
import { connect } from 'react-redux';
import { Layout } from 'antd';
import { Brick, BrickSelector } from '..';
import * as utils from '../../utils';
import './Components.css';

/**
 * Display the list of current file's bricks/components.
 */
class Components extends React.Component {
  shouldDisplayComponents = () => {
    const currentFile = this.props.currentFile;
    const currentFileExtension = utils.file.whichLanguage(currentFile.filePath);

    switch (currentFileExtension) {
      case 'jsx':
      case 'js':
      case 'tsx':
        return true;

      default:
        return false;
    }
  }

  render() {
    const shouldDisplayComponents = this.shouldDisplayComponents();

    return (
      <div className="Components" style={{ opacity: shouldDisplayComponents ? 1 : 0.5 }}>
        <BrickSelector />

        <div className="bricks">
          {this.props.bricks.map((brick) =>
            <Brick key={key()} brick={brick} />
          )}
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  currentFile: state.session.currentFile,
  bricks: state.session.currentSession.bricks,
});

export default connect(mapStateToProps)(Components);

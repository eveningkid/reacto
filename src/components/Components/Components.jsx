import React from 'react';
import PropTypes from 'prop-types';
import key from 'uniqid';
import { connect } from 'react-redux';
import { Brick, BrickSelector } from '..';
import BrickType from '../../bricks/baseBrick';
import FileType from '../../editor/file';
import * as utils from '../../utils';
import './Components.css';

/**
 * Display the list of current file's bricks/components.
 */
class Components extends React.Component {
  static propTypes = {
    bricks: PropTypes.arrayOf(PropTypes.instanceOf(BrickType)),
    currentFile: PropTypes.instanceOf(FileType),
  };

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
  };

  render() {
    const shouldDisplayComponents = this.shouldDisplayComponents();

    return (
      <div
        className="Components"
        style={{ opacity: shouldDisplayComponents ? 1 : 0.5 }}
      >
        <BrickSelector />

        <div className="bricks">
          {this.props.bricks.map(brick => <Brick key={key()} brick={brick} />)}
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

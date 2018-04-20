import React from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import { FileTree, OpenedFiles } from '../';
import './ProjectSider.css';

/**
 * Wrapper for the left project sider.
 */
class ProjectSider extends React.Component {
  render() {
    const classes = classNames('ProjectSider', {
      show: this.props.isFileTreeOpened,
    });
    return (
      <div className={classes}>
        <OpenedFiles />
        <FileTree />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  isFileTreeOpened: state.ui.isFileTreeOpened,
});

export default connect(mapStateToProps)(ProjectSider);

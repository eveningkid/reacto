import React from 'react';
import { FileTree, OpenedFiles } from '../';
import './ProjectSider.css';

/**
 * Wrapper for the left project sider.
 */
class ProjectSider extends React.Component {
  render() {
    return (
      <div className="ProjectSider">
        <OpenedFiles />
        <FileTree />
      </div>
    );
  }
}

export default ProjectSider;

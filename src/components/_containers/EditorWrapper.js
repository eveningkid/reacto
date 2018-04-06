import React from 'react';
import PropTypes from 'prop-types';
import DocumentTitle from 'react-document-title';
import { connect } from 'react-redux';
import { Layout } from 'antd';
import {
  ComponentPreviewRenderer,
  Components,
  Editor,
  EditorHeader,
  ProjectSider,
  PromptUser,
} from '..';
import FileType from '../../editor/file';
import PackageManagerType from '../../tools/package-managers/_base/package-manager';
import * as packageManagers from '../../tools/package-managers';
import * as taskRunners from '../../tools/task-runners';

/**
 * Contain the whole code editor.
 */
class EditorWrapper extends React.Component {
  static propTypes = {
    currentFile: PropTypes.instanceOf(FileType),
    isBrickSelectorOpened: PropTypes.bool,
    isFileTreeOpened: PropTypes.bool,
    packageManager: PropTypes.instanceOf(PackageManagerType),
    projectUpdatePackageManager: PropTypes.func,
  };

  async componentDidMount() {
    // TODO move this to /editor/startup.js

    const yarnPackageManager = new packageManagers.YarnPackageManager();

    if (await yarnPackageManager.isAvailable()) {
      this.props.updatePackageManager(yarnPackageManager);
    } else {
      const npmPackageManager = new packageManagers.NpmPackageManager();
      this.props.updatePackageManager(npmPackageManager);
    }

    const npmTaskRunner = new taskRunners.NpmTaskRunner();
    this.props.updateTaskRunner(npmTaskRunner);
  }

  componentWillUpdate(nextProps) {
    if (!this.props.packageManager && nextProps.packageManager) {
      nextProps.packageManager.run();
    }

    if (!this.props.taskRunner && nextProps.taskRunner) {
      nextProps.taskRunner.run();
    }

    if (
      this.props.packageManager &&
      this.props.packageManager !== nextProps.packageManager
    ) {
      this.props.packageManager.stop();
      nextProps.packageManager.run();
    }

    if (
      this.props.taskRunner &&
      this.props.taskRunner !== nextProps.taskRunner
    ) {
      this.props.taskRunner.stop();
      nextProps.taskRunner.run();
    }
  }

  render() {
    return (
      <DocumentTitle title={this.props.currentFile.filePath}>
        <div className="dark-theme">
          <PromptUser />

          <Layout>
            <Layout.Content>
              <EditorHeader />

              <Layout>
                <Layout.Sider width={this.props.isFileTreeOpened ? 250 : 0}>
                  <ProjectSider />
                </Layout.Sider>

                <Layout.Content className="editor-content">
                  <ComponentPreviewRenderer />
                  <Editor />
                </Layout.Content>
              </Layout>
            </Layout.Content>

            <Layout.Sider width={this.props.isBrickSelectorOpened ? 300 : 0}>
              <Components />
            </Layout.Sider>
          </Layout>
        </div>
      </DocumentTitle>
    );
  }
}

const mapStateToProps = state => ({
  isFileTreeOpened: state.ui.isFileTreeOpened,
  isBrickSelectorOpened: state.ui.isBrickSelectorOpened,
  packageManager: state.project.packageManager,
  currentFile: state.session.currentFile || '',
});

const mapDispatchToProps = dispatch => ({
  updatePackageManager: packageManager =>
    dispatch.project.updatePackageManager({ packageManager }),
  updateTaskRunner: taskRunner =>
    dispatch.project.updateTaskRunner({ taskRunner }),
});

export default connect(mapStateToProps, mapDispatchToProps)(EditorWrapper);

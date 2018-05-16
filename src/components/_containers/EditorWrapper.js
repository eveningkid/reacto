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
  TodoList,
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

  componentDidUpdate(prevProps) {
    if (!prevProps.packageManager && this.props.packageManager) {
      this.props.packageManager.run();
    }

    if (!prevProps.taskRunner && this.props.taskRunner) {
      this.props.taskRunner.run();
    }

    if (
      prevProps.packageManager &&
      prevProps.packageManager !== this.props.packageManager
    ) {
      prevProps.packageManager.stop();
      this.props.packageManager.run();
    }

    if (
      prevProps.taskRunner &&
      prevProps.taskRunner !== this.props.taskRunner
    ) {
      prevProps.taskRunner.stop();
      this.props.taskRunner.run();
    }
  }

  render() {
    let siderWidth = 0;
    if (this.props.isFileTreeOpened) siderWidth += 250;
    if (this.props.isTodoListOpened) siderWidth += 250;

    return (
      <DocumentTitle title={this.props.currentFile.filePath}>
        <div className="dark-theme">
          <PromptUser />

          <Layout>
            <Layout.Content>
              <EditorHeader />

              <Layout>
                <Layout.Sider width={siderWidth}>
                  <ProjectSider />
                  <TodoList />
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
  isTodoListOpened: state.ui.isTodoListOpened,
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

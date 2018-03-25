import React from 'react';
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
import * as packageManagers from '../../tools/package-managers';

/**
 * Contain the whole code editor.
 */
class EditorWrapper extends React.Component {
  async componentWillMount() {
    // TODO move this to /editor/startup.js

    const yarnPackageManager = new packageManagers.YarnPackageManager();

    if (await yarnPackageManager.isAvailable()) {
      this.props.projectUpdatePackageManager(yarnPackageManager);
    } else {
      const npmPackageManager = new packageManagers.NpmPackageManager();
      this.props.projectUpdatePackageManager(npmPackageManager);
    }
  }

  componentWillUpdate(nextProps) {
    if (!this.props.packageManager && nextProps.packageManager) {
      nextProps.packageManager.run();
    }

    if (this.props.packageManager && this.props.packageManager !== nextProps.packageManager) {
      this.props.packageManager.stop();
      nextProps.packageManager.run();
    }
  }

  render() {
    return (
      <DocumentTitle title={this.props.currentFile.filePath}>
        <div className="delayed animated fadeIn dark-theme">
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

const mapStateToProps = (state) => ({
  isFileTreeOpened: state.ui.isFileTreeOpened,
  isBrickSelectorOpened: state.ui.isBrickSelectorOpened,
  packageManager: state.project.packageManager,
  currentFile: state.session.currentFile || '',
});

const mapDispatchToProps = dispatch => ({
  projectUpdatePackageManager: packageManager => dispatch.project.updatePackageManager({ packageManager }),
});

export default connect(mapStateToProps, mapDispatchToProps)(EditorWrapper);

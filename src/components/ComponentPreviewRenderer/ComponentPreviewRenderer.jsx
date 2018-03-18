import React from 'react';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { ComponentPreview } from '../../tools/component-preview';
import './ComponentPreviewRenderer.css';
const watch = window.require('node-watch');

// Modules to install in order to compile using the babel loader
const modulesToInstall = [
  'babel-core',
  'babel-preset-env',
  'babel-preset-flow',
  'babel-preset-react',
  'babel-preset-stage-3',
];

// TODO deal with wrapped components
// Such as connect(..., ...)(Component),
//         wrapper(Component), ...
// IDEA check the last lines of the file content
// Also pure components
// function ...(props) {}
class ComponentPreviewRenderer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpened: false,
      hasCompiled: false,
      hasError: false,
    };
  }

  componentWillMount() {
    if (this.props.filePath) {
      this.initCompilation(this.props);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.filePath && nextProps.filePath !== this.props.filePath) {
      this.initCompilation(nextProps);
    }

    // Somehow, the preview should be closed as the new path contains nothing
    if (this.props.filePath && nextProps.filePath === null) {
      this.closePreview();
    }
  }

  componentWillUnmount() {
    this.closeWatcher();
  }

  watchFor = (props) => {
    this.buildPreview(props);
    this.closeWatcher();
    this.watcher = watch(props.filePath);
    this.watcher.on('change', () => this.buildPreview(props));
  }

  closeWatcher = () => {
    if (this.watcher) {
      this.watcher.close();
      this.componentPreview.stop();
    }
  }

  buildPreview = async (props) => {
    this.componentPreview = new ComponentPreview(this.props);

    this.setState({ hasCompiled: false }, async () => {
      try {
        const { success } = await this.componentPreview.buildPreview(props);

        if (success) {
          this.successfulBuild();
        }
      } catch (error) {
        this.nonSuccessfulBuild(error);
      }
    });
  }

  successfulBuild = () => this.setState({ hasError: false, hasCompiled: true });
  nonSuccessfulBuild = (error) => this.setState({ hasError: true, error, hasCompiled: true });

  initCompilation = (props) => {
    this.setState({ isOpened: true });

    if (this.canCompile()) {
      this.watchFor(props);
    } else {
      this.installCompilerDependencies(props);
    }
  }

  canCompile = () => {
    return modulesToInstall
      .map(moduleName => this.props.packageManager.isInstalled(moduleName))
      .filter(isInstalled => isInstalled)
      .length === modulesToInstall.length;
  }

  installCompilerDependencies = async (props) => {
    const packageManager = this.props.packageManager;
    const options = { isDev: true };

    const missingModulesToInstall = modulesToInstall.filter((moduleName) =>{
      return !packageManager.isInstalled(moduleName);
    });

    // TODO show this graphically
    for (const moduleName of missingModulesToInstall) {
      await packageManager.add(moduleName, options);
    }

    this.initCompilation(props);
  }

  closePreview = () => {
    this.closeWatcher();
    this.setState({ isOpened: false });
    this.props.updateComponentPreviewFilePath(null);
  }

  render() {
    let isReady = false;

    if (this.props.filePath && this.state.hasCompiled) {
      isReady = true;
    }

    const classes = classNames('ComponentPreviewRenderer', {
      'is-opened': this.state.isOpened,
      'is-ready': isReady,
    });

    return (
      <div className={classes}>
        {this.state.hasCompiled ?
          <div className="status" onClick={this.closePreview}>
            Close Preview
          </div> :
          <div className="status">
            ~ Compiling
          </div>
        }

        {this.state.hasError && (
          <div className="error">
            <strong>{this.state.error.code}</strong>
            <p className="message">{this.state.error.message}</p>
            <p className="stack">{this.state.error.stack}</p>
          </div>
        )}

        <div className="component-preview-content" />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  cwd: state.project.cwd,
  filePath: state.project.componentPreview.filePath,
  packageManager: state.project.packageManager,
});

const mapDispatchToProps = dispatch => ({
  updateComponentPreviewFilePath: filePath => dispatch.project.updateComponentPreviewFilePath({ filePath }),
});

export default connect(mapStateToProps, mapDispatchToProps)(ComponentPreviewRenderer);

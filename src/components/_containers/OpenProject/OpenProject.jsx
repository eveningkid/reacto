import React from 'react';
import classNames from 'classnames';
import key from 'uniqid';
import { connect } from 'react-redux';
import { ApplicationManager, NotificationManager } from '../../../editor/managers';
import { Button, Spinner } from '../../_ui';
import config from '../../../config';
import ReactoLogo from '../../../themes/logo.svg';
import './OpenProject.css';

const path = window.require('path');
const { remote } = window.require('electron');

/**
 * Welcome screen.
 * Allow the user to create, open a React project.
 */
class OpenProject extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: '',
      isChoosingFolder: false,
      isInstalling: false,
      installationPath: '',
    };
  }

  componentWillMount() {
    if (
      !this.props.blockRedirect
      && this.props.recentProjects.length > 0
      && config().startup.openLastOpenedProject
    ) {
      this.openingDirectory(this.props.recentProjects[0]);
    }
  }

  handleOpenProject = () => {
    this.setState({ isChoosingFolder: true });

    remote.dialog.showOpenDialog({
      properties: ['openDirectory']
    }, (filePaths) => {
      const cwd = filePaths && filePaths.shift();

      if (cwd) {
        // Update cwd
        this.openingDirectory(cwd);
      } else {
        this.setState({ isChoosingFolder: false });
      }
    });
  }

  handleCreateProject = () => {
    this.setState({ isChoosingFolder: true });

    remote.dialog.showOpenDialog({
      properties: ['openDirectory', 'createDirectory']
    }, (filePaths) => {
      const pathToDirectory = filePaths && filePaths.shift();

      if (pathToDirectory) {
        // Create app
        this.createReactApp(pathToDirectory);
      } else {
        this.setState({ isChoosingFolder: false });
      }
    });
  }

  createReactApp = async (pathToDirectory) => {
    this.setState({
      isInstalling: true,
      error: '',
      installationPath: pathToDirectory,
    });

    if (!await ApplicationManager.environment.hasCommand('npx')) {
      // npx comes with npm 5.2+ and higher
      const npmVersion = await ApplicationManager.environment.run('npm', ['--version']) || 'unknown';

      return this.setState({
        isInstalling: false,
        isChoosingFolder: false,
        error: `You need to update npm to 5.2 or higher. Currently using ${npmVersion}.`,
      });
    }

    await ApplicationManager.environment.run('npx', ['create-react-app', pathToDirectory]);
    NotificationManager.success('App successfully created!');
    this.openingDirectory(pathToDirectory);
  }

  openingDirectory = (cwd) => {
    this.setState({ isChoosingFolder: true, isInstalling: false });
    this.props.switchProject(cwd);
  }

  renderRecentProjects = () => {
    const recentProjects = this.props.recentProjects;

    if (!recentProjects.length) {
      return null;
    }

    // Display only the 3 latest opened projects
    return (
      <div className="recent-projects">
        {recentProjects.slice(0, 3).map(cwd => (
          <Button
            key={key()}
            className="recent-project"
            small
            onClick={this.openingDirectory.bind(this, cwd)}
          >
            {path.basename(cwd)}
          </Button>
        ))}
      </div>
    );
  }

  render() {
    const classes = classNames('OpenProject', 'delayed', 'animated', {
      'fadeIn': !this.state.isChoosingFolder,
      'fadeOut': this.state.isChoosingFolder && !this.state.isInstalling,
    });

    return (
      <div className={classes}>
        {this.state.isInstalling ?
          <Spinner text="We'll notify you when your new React App is ready" /> : (
          <React.Fragment>
            <img id="logo" src={ReactoLogo} alt="Logo" />
            {this.state.error && <p className="error">{this.state.error}</p>}
            <Button onClick={this.handleOpenProject}>Open a React project</Button>
            {this.renderRecentProjects()}
            <p>or <strong onClick={this.handleCreateProject}>Create a new one</strong></p>
          </React.Fragment>
        )}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  cwd: state.project.cwd,
  recentProjects: state.history.recentProjects,
});

const mapDispatchToProps = dispatch => ({
  switchProject: cwd => dispatch.project.switchProject(cwd),
});

export default connect(mapStateToProps, mapDispatchToProps)(OpenProject);

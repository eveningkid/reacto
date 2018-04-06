import React from 'react';
import PropTypes from 'prop-types';
import key from 'uniqid';
import { connect } from 'react-redux';
import { Popover } from 'antd';
import { Container, List, Text } from '../../../components/_ui';

const noAvailableTasks = <Text light>No available script.</Text>;
const noRunningScripts = <Text light>No running script.</Text>;

class TaskRunnerRenderer extends React.Component {
  static propTypes = {
    availableTasks: PropTypes.any,
    runningTasks: PropTypes.any,
    taskRunner: PropTypes.any,
    onBusy: PropTypes.func,
    onIdle: PropTypes.func,
  };

  state = {
    isOpened: false,
    installOptions: [],
  };

  trySetIdle = () => {
    if (this.props.onIdle && this.props.taskRunner) {
      if (this.props.taskRunner.runningTasks.length === 0) {
        this.props.onIdle();
      }
    }
  };

  runScript = scriptName => {
    this.props.onBusy && this.props.onBusy();
    this.props.taskRunner
      .run(scriptName)
      .then(() => this.trySetIdle())
      .catch(() => this.trySetIdle());
  };

  forceStopScript = scriptName => {
    this.props.taskRunner.stop(scriptName);
    this.trySetIdle();
  };

  isTaskRunning = scriptName => {
    return this.props.runningTasks.find(task => task.scriptName === scriptName);
  };

  renderPopover() {
    const runningTasks = this.props.runningTasks;
    const availableTasks = this.props.availableTasks;

    return (
      <React.Fragment>
        <Container>
          <h1>Running Scripts</h1>

          <List noItems={noRunningScripts}>
            {runningTasks.map(task => (
              <List.Entry
                key={key()}
                checked={true}
                onCheck={this.forceStopScript.bind(this, task.scriptName)}
              >
                {task.scriptName}
              </List.Entry>
            ))}
          </List>
        </Container>

        <Container>
          <h1>Available Scripts</h1>

          <List noItems={noAvailableTasks}>
            {availableTasks.map(([scriptName]) => (
              <List.Entry
                key={key()}
                checked={this.isTaskRunning(scriptName)}
                onCheck={this.runScript.bind(this, scriptName)}
              >
                {scriptName}
              </List.Entry>
            ))}
          </List>
        </Container>
      </React.Fragment>
    );
  }

  render() {
    return (
      <Popover
        placement="bottom"
        content={this.renderPopover()}
        trigger="click"
        onVisibleChange={isOpened => this.setState({ isOpened })}
        overlayStyle={{ width: 250 }}
      >
        Task Runner
      </Popover>
    );
  }
}

const mapStateToProps = state => ({
  availableTasks: state.project.taskRunner.availableTasks(),
  runningTasks: state.project.taskRunner.runningTasks,
  taskRunner: state.project.taskRunner,
});

export default connect(mapStateToProps)(TaskRunnerRenderer);

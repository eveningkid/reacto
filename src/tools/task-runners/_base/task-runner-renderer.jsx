import React from 'react';
import PropTypes from 'prop-types';
import key from 'uniqid';
import { connect } from 'react-redux';
import { Popover } from 'antd';
import { Container, InputSearch, List, Text } from '../../../components/_ui';
import './TaskRunnerPopover.css';

const noAvailableTasks = <Text light>No available script.</Text>;
const noTasksFound = <Text light>No script found.</Text>;
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
    search: '',
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
    return (
      this.props.runningTasks.filter(task => task.scriptName === scriptName)
        .length === 1
    );
  };

  onChangeSearch = search => {
    this.setState({ search });
  };

  renderPopover() {
    const runningTasks = this.props.runningTasks;
    const availableTasks = this.props.availableTasks;
    const search = this.state.search.toLowerCase();

    return (
      <div className="TaskRunnerPopover">
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

        <InputSearch
          value={this.state.search}
          onChange={this.onChangeSearch}
          placeholder="Search among scripts..."
          style={{ marginBottom: 10 }}
        />

        <Container>
          <h1>Available Scripts</h1>

          <List noItems={this.state.search ? noTasksFound : noAvailableTasks}>
            {availableTasks
              .filter(([scriptName]) =>
                scriptName.toLowerCase().includes(search)
              )
              .map(([scriptName, command]) => (
                <List.Entry
                  key={key()}
                  checked={this.isTaskRunning(scriptName)}
                  onCheck={this.runScript.bind(this, scriptName)}
                  title={command}
                >
                  {scriptName}
                </List.Entry>
              ))}
          </List>
        </Container>
      </div>
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

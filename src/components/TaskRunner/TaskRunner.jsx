import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { ToolbarButton } from '../_ui';
import TaskRunnerRenderer from '../../tools/task-runners/_base/task-runner-renderer';

class TaskRunner extends React.Component {
  static propTypes = {
    taskRunner: PropTypes.any,
  };

  state = {
    loading: false,
  };

  handleBusy = () => this.setState({ loading: true });

  handleIdle = () => this.setState({ loading: false });

  render() {
    const taskRunner = this.props.taskRunner;
    if (!taskRunner) return null;

    return (
      <ToolbarButton loading={this.state.loading}>
        <TaskRunnerRenderer
          taskRunner={taskRunner}
          onBusy={this.handleBusy}
          onIdle={this.handleIdle}
        />
      </ToolbarButton>
    );
  }
}

const mapStateToProps = state => ({
  taskRunner: state.project.taskRunner,
});

export default connect(mapStateToProps)(TaskRunner);

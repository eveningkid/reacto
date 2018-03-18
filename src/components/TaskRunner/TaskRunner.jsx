import React from 'react';
import { connect } from 'react-redux';
import TaskRunnerRenderer from '../../tools/task-runners/_base/task-runner-renderer';

class TaskRunner extends React.Component {
  render() {
    const { taskRunner } = this.props;

    return (
      <div className={this.props.className}>
        {taskRunner && <TaskRunnerRenderer taskRunner={taskRunner} />}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  taskRunner: state.project.taskRunner,
});

export default connect(mapStateToProps)(TaskRunner);

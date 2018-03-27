import React from 'react';
import { connect } from 'react-redux';
import TaskRunnerRenderer from '../../tools/task-runners/_base/task-runner-renderer';

const TaskRunner = ({ taskRunner, className }) => (
  <div className={className}>
    {taskRunner && <TaskRunnerRenderer taskRunner={taskRunner} />}
  </div>
);

const mapStateToProps = (state) => ({
  taskRunner: state.project.taskRunner,
});

export default connect(mapStateToProps)(TaskRunner);

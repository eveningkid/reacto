import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import TaskRunnerRenderer from '../../tools/task-runners/_base/task-runner-renderer';
import TaskRunnerType from '../../tools/task-runners/_base/task-runner';

function TaskRunner(props) {
  const { taskRunner, className } = props;

  return (
    <div className={className}>
      {taskRunner && <TaskRunnerRenderer taskRunner={taskRunner} />}
    </div>
  );
}

TaskRunner.propTypes = {
  className: PropTypes.string,
  taskRunner: PropTypes.instanceOf(TaskRunnerType),
};

const mapStateToProps = state => ({
  taskRunner: state.project.taskRunner,
});

export default connect(mapStateToProps)(TaskRunner);

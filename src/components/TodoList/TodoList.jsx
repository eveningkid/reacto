import React from 'react';
import { connect } from 'react-redux';
import { dispatch } from '@rematch/core';
import classNames from 'classnames';
import key from 'uniqid';
import { ToolbarButton } from '../_ui';
import { TodoManager } from '../../editor/managers';
import './TodoList.css';

class TodoGroup extends React.Component {
  shouldComponentUpdate() {
    return false;
  }

  render() {
    const { className, file, todos } = this.props;
    return (
      <div className={className}>
        <div
          className="path"
          title={file.filePath}
          onClick={() => dispatch.session.openFileAsync(file.filePath)}
        >
          {file.basename()}
        </div>

        {todos.map(todo => (
          <div className="Todo" key={key()}>
            <div className="text">{todo.text}</div>
          </div>
        ))}
      </div>
    );
  }
}

class TodoList extends React.Component {
  componentDidMount() {
    TodoManager.find();
  }

  sortTodos([a], [b]) {
    if (a.basename() !== b.basename()) {
      a = a.basename();
      b = b.basename();
    } else {
      a = a.filePath;
      b = b.filePath;
    }
    a = a.toLowerCase();
    b = b.toLowerCase();
    if (a < b) return -1;
    if (a > b) return 1;
    return 0;
  }

  shouldComponentUpdate(nextProps) {
    if (nextProps.isTodoListOpened) return true;
    if (nextProps.todos.length !== this.props.todos.length) return true;
    return false;
  }

  renderTodos = ([file, todos]) => {
    const classes = classNames('TodoGroup', {
      'is-current-file': file.filePath === this.props.currentFile.filePath,
    });
    return (
      <TodoGroup key={key()} className={classes} file={file} todos={todos} />
    );
  };

  render() {
    const classes = classNames('TodoList', {
      show: this.props.isTodoListOpened,
    });
    return (
      <div className={classes}>
        <ToolbarButton onClick={() => TodoManager.find()}>
          Refresh TODOs
        </ToolbarButton>
        {this.props.todos.sort(this.sortTodos).map(this.renderTodos)}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  isTodoListOpened: state.ui.isTodoListOpened,
  todos: state.project.todos,
  currentFile: state.session.currentFile,
});

export default connect(mapStateToProps)(TodoList);

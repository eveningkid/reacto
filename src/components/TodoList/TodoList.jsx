import React from 'react';
import { connect } from 'react-redux';
import { dispatch } from '@rematch/core';
import classNames from 'classnames';
import key from 'uniqid';
import './TodoList.css';

class TodoList extends React.Component {
  sortTodos(a, b) {
    a = a.file.basename().toLowerCase();
    b = b.file.basename().toLowerCase();
    if (a < b) return -1;
    if (a > b) return 1;
    return 0;
  }

  renderTodo = (todo, index, todos) => {
    const nextTodo = todos[index + 1];
    const prevTodo = todos[index - 1];
    let showFilePath = true;
    if (prevTodo && prevTodo.file.filePath === todo.file.filePath) {
      showFilePath = false;
    }
    let isLastChildWithSameFilePath = false;
    if (nextTodo && nextTodo.file.filePath !== todo.file.filePath) {
      isLastChildWithSameFilePath = true;
    }
    const isCurrentFile =
      this.props.currentFile.filePath === todo.file.filePath;
    const classes = classNames('Todo', {
      'show-filepath': showFilePath,
      'last-child-same-filepath': isLastChildWithSameFilePath,
      'is-current-file': isCurrentFile,
    });
    return (
      <div className={classes} key={key()}>
        {showFilePath && (
          <div
            className="path"
            title={todo.file.filePath}
            onClick={() => dispatch.session.openFileAsync(todo.file.filePath)}
          >
            {todo.file.basename()}
          </div>
        )}
        <div className="text">{todo.text}</div>
      </div>
    );
  };

  render() {
    const classes = classNames('TodoList', {
      show: this.props.isTodoListOpened,
    });
    return (
      <div className={classes}>
        {this.props.todos.sort(this.sortTodos).map(this.renderTodo)}
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

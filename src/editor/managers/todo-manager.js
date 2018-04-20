import { dispatch } from '@rematch/core';
import File from '../file';
import { ApplicationManager, FileTreeManager } from '.';
const fs = window.require('fs');

class TodoManager {
  static COMMENTS_REGEX = /(?:(?:^|\s)\/\/(.+?)$)|(?:\/\*([\S\s]*?)\*\/)/gm;
  static FILE_TO_PARSE_REGEX = /\.(js|jsx|scss|css|tsx|ts)/gi;
  static NEW_LINE_REGEX = /(\r\n|\n|\r)/gm;
  static IS_LINE_TODO_REGEX = /(todo)/gi;

  static _findWorker(path) {
    return new Promise(resolve => {
      fs.readFile(path, 'utf8', (err, data) => {
        if (err || !data) resolve([]);
        const matches = data.match(this.COMMENTS_REGEX);
        const found = [];
        if (matches) {
          matches.forEach(match => {
            if (match.match(/todo/i)) {
              const text = this._parseMatch(match);
              if (text) {
                const todo = {
                  match,
                  text,
                };
                found.push(todo);
              }
            }
          });
        }
        if (found.length) resolve([new File(path), found]);
        else resolve([]);
      });
    });
  }

  /**
   *
   * @param {string} match
   */
  static _parseMatch(match) {
    let text = '';
    const lines = match.split(this.NEW_LINE_REGEX);
    for (const line of lines) {
      if (line.match(this.IS_LINE_TODO_REGEX)) {
        text = line
          .replace(/\/?(\/|(\*)*)/gi, '')
          .replace(this.IS_LINE_TODO_REGEX, '')
          .replace(' : ', '')
          .trim();
      }
    }
    return text;
  }

  static find() {
    const cwd = ApplicationManager.environment.getCWD();
    const paths = FileTreeManager.find(this.FILE_TO_PARSE_REGEX)
      .filter(path => !path.includes('build') && !path.includes('dist'))
      .map(path => cwd + path);

    const workers = [];
    for (const path of paths) {
      workers.push(this._findWorker(path));
    }

    Promise.all(workers).then(todos => {
      todos = todos.filter(currentTodos => currentTodos.length > 0);
      dispatch.project.replaceTodos(todos);
    });
  }
}

export default TodoManager;

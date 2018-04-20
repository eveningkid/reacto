import React from 'react';
import keycodes from 'keycodes';
import key from 'uniqid';
import { getState } from '@rematch/core';
import { SearchSuggestion } from '..';
import { Text } from '../_ui';
import { PromptUserManager } from '../../editor/managers';
import './PromptUser.css';

const initialState = {
  answer: '',
  question: null,
  afterQuestionCallback: undefined,
  suggestions: [],
  currentSuggestionIndex: -1,
  showCurrentSuggestionDescription: false,
};

/**
 * Element allowing to ask questions to user.
 * Powering file search UI, new file, rename file...
 */
class PromptUser extends React.Component {
  constructor(props) {
    super(props);
    this.state = initialState;
  }

  componentWillMount() {
    PromptUserManager.onQuestion((question, afterQuestionCallback) => {
      let answer = question.inputPlaceholder;

      if (question.shouldBeEmptyAtMounting) {
        answer = '';
      }

      this.setState({ question, afterQuestionCallback, answer });
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.input) {
      this.input.focus();

      if (
        !prevState.answer.length &&
        this.state.answer.length &&
        this.state.question.selection
      ) {
        const selection = this.state.question.selection;
        this.input.setSelectionRange(selection.start, selection.end);
      }
    }
  }

  /**
   * If the user presses 'esc', close the modal
   */
  handleKeyDown = event => {
    const keycode = keycodes(event.keyCode);

    switch (keycode) {
      case 'esc':
        this.cancelQuestion();
        break;

      case 'up':
      case 'down':
        this.setSuggestionIndex(keycode);
        break;

      case 'alt':
        if (!this.state.showCurrentSuggestionDescription) {
          this.setState({ showCurrentSuggestionDescription: true });
        }
        break;

      default:
      // Pass
    }
  };

  handleKeyUp = event => {
    if (this.state.showCurrentSuggestionDescription && !event.altKey) {
      this.setState({ showCurrentSuggestionDescription: false });
    }
  };

  handleChange = event => {
    const answer = event.target.value;

    if (this.state.question.getSuggestions && answer.length > 0) {
      const suggestions = this.state.question.getSuggestions(answer);
      this.setState({ answer, suggestions, currentSuggestionIndex: 0 });
    } else {
      this.setState({ answer });
    }
  };

  setSuggestionIndex = direction => {
    let currentSuggestionIndex = this.state.currentSuggestionIndex;

    if (direction === 'up') {
      // Up
      currentSuggestionIndex -= 1;
      if (currentSuggestionIndex === -1) {
        currentSuggestionIndex = this.state.suggestions.length - 1;
      }
    } else {
      // Down
      currentSuggestionIndex += 1;
    }

    currentSuggestionIndex %= this.state.suggestions.length;
    this.setState({ currentSuggestionIndex });
  };

  /**
   * Call callback, passing it the user's input
   */
  answerQuestion = event => {
    event.preventDefault();

    const answer = this.state.answer;
    if (this.state.currentSuggestionIndex !== -1) {
      this.state.suggestions[this.state.currentSuggestionIndex].select(answer);
    } else {
      this.state.afterQuestionCallback(answer);
    }

    this.cancelQuestion();
  };

  /**
   * Reset state. Visually close the question modal
   */
  cancelQuestion = () => {
    getState().session.editor.focus();
    this.setState({ ...initialState });
  };

  renderSuggestion = (suggestion, index) => {
    const selected = this.state.currentSuggestionIndex === index;
    return (
      <SearchSuggestion
        key={key()}
        suggestion={suggestion}
        input={this.state.answer}
        selected={selected}
        showFullDescription={
          selected && this.state.showCurrentSuggestionDescription
        }
      />
    );
  };

  render() {
    if (!this.state.question) {
      return null;
    }

    return (
      <div className="PromptUser" onClick={this.cancelQuestion}>
        <div className="question" onClick={event => event.stopPropagation()}>
          <form onSubmit={this.answerQuestion}>
            <div className="title">{this.state.question.question}</div>

            <input
              ref={element => (this.input = element)}
              value={this.state.answer}
              placeholder={this.state.question.inputPlaceholder || null}
              onChange={this.handleChange}
              onKeyDown={this.handleKeyDown}
              onKeyUp={this.handleKeyUp}
            />
          </form>

          {this.state.suggestions.length > 0 && (
            <div className="suggestions">
              {this.state.suggestions.map(this.renderSuggestion)}
              <div className="hint">
                <Text light>
                  Hold <kbd>Alt</kbd> to show the full directory name
                </Text>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default PromptUser;

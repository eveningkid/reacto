import React from 'react';
import keycodes from 'keycodes';
import key from 'uniqid';
import classNames from 'classnames';
import './InputSearch.css';

const initialState = {
  suggestionIndex: -1,
  suggestions: [],
};

class InputSearch extends React.Component {
  constructor(props) {
    super(props);
    this.state = initialState;
  }

  componentWillUpdate(nextProps) {
    if (nextProps.autoFocus) {
      this.input.focus();
    }
  }

  handleChange = (event) => {
    const search = event.target.value;
    this.props.suggestions && this.displaySuggestions(search.toLowerCase());
    this.props.onChange(search);
  }

  handleFocus = (event) => {
    this.props.suggestions && this.displaySuggestions();
  }

  handleBlur = (event) => {
    this.setState({ ...initialState });
  }

  handleSubmit = (event) => {
    let toSearch = this.props.value;

    if (this.state.suggestions && this.state.suggestions[this.state.suggestionIndex]) {
      toSearch = this.state.suggestions[this.state.suggestionIndex];
    }

    this.props.onSearch(toSearch);
    this.setState({ ...initialState });
  }

  handleKey = (event) => {
    const keyName = keycodes(event.keyCode);

    switch (keyName) {
      case 'down':
        if (this.props.suggestions) {
          this.browseSuggestions('down');
        }
        break;

      case 'up':
        if (this.props.suggestions) {
          this.browseSuggestions('up');
        }
        break;

      case 'enter':
        this.handleSubmit();
        break;

      case 'esc':
        this.input.blur();
        this.props.onEscape && this.props.onEscape();
        break;

      default:
        // Pass
    }
  }

  browseSuggestions = (direction) => {
    let suggestionIndex = this.state.suggestionIndex;

    if (direction === 'up') {
      suggestionIndex -= 1;
    } else if (direction === 'down') {
      suggestionIndex += 1;
    }

    suggestionIndex = suggestionIndex % this.state.suggestions.length;
    this.setState({ suggestionIndex });
  }

  displaySuggestions = (search) => {
    let suggestions = this.props.suggestions;

    if (search && search.length > 0) {
      suggestions = suggestions.filter((suggestion) => suggestion.toLowerCase().includes(search));
    }

    this.setState({ suggestions, suggestionIndex: 0 });
  }

  renderSuggestion = (suggestion, index) => {
    const classes = classNames('suggestion', {
      'is-selected': index === this.state.suggestionIndex,
    });

    return <div key={key()} className={classes}>{suggestion}</div>;
  }

  render() {
    return (
      <div className="InputSearch">
        <input
          ref={(element) => this.input = element}
          type="text"
          placeholder={this.props.placeholder}
          value={this.props.value}
          onChange={this.handleChange}
          onKeyDown={this.handleKey}
          onFocus={this.handleFocus}
          onBlur={this.handleBlur}
        />

        {this.props.suggestions && (
          <div className="suggestions">
            {this.state.suggestions.map(this.renderSuggestion)}
          </div>
        )}
      </div>
    );
  }
}

export default InputSearch;

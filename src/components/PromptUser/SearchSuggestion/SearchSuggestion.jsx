import React from 'react';
import classNames from 'classnames';
import './SearchSuggestion.css';

/**
 * Display a unique search suggestion.
 */
function SearchSuggestion(props) {
  const { input, selected, suggestion } = props;
  const classes = classNames('SearchSuggestion', { selected });
  const regex = new RegExp(input, 'i');
  const title = suggestion.title.replace(regex, '<u>$&</u>');

  return (
    <div className={classes}>
      <span className="type">{suggestion.type}</span>
      <span className="title" dangerouslySetInnerHTML={{ __html: title }} />
      <span className="description">{suggestion.description}</span>
    </div>
  );
}

export default SearchSuggestion;

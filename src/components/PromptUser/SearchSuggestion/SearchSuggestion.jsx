import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import './SearchSuggestion.css';

/**
 * Display a unique search suggestion.
 */
function SearchSuggestion(props) {
  const { input, selected, suggestion, showFullDescription } = props;
  const classes = classNames('SearchSuggestion', { selected });
  const regex = new RegExp(input, 'i');
  const title = suggestion.title.replace(regex, '<u>$&</u>');

  return (
    <div className={classes}>
      <span className="type">{suggestion.type}</span>
      {showFullDescription ? (
        <span className="description truncate">{suggestion.description}</span>
      ) : (
        <React.Fragment>
          <span className="title" dangerouslySetInnerHTML={{ __html: title }} />
          <span className="description truncate">{suggestion.description}</span>
        </React.Fragment>
      )}
    </div>
  );
}

SearchSuggestion.propTypes = {
  input: PropTypes.node,
  selected: PropTypes.bool,
  suggestion: PropTypes.object,
  showFullDescription: PropTypes.bool,
};

export default SearchSuggestion;

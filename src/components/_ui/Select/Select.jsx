import React from 'react';
import PropTypes from 'prop-types';
import './Select.css';

function Select(props) {
  const { onChange, onClick, ...otherProps } = props;
  let handleOnChange = undefined;
  let handleOnClick;

  if (onChange) {
    handleOnChange = event => {
      event.stopPropagation();
      onChange(event.target.value);
    };
  }

  if (onClick) {
    handleOnClick = event => {
      event.stopPropagation();
      onClick(event);
    };
  } else {
    handleOnClick = event => event.stopPropagation();
  }

  return (
    <select
      className="Select"
      onClick={handleOnClick}
      onChange={handleOnChange}
      {...otherProps}
    />
  );
}

function SelectOption(props) {
  return <option {...props} />;
}

Select.Option = SelectOption;
Select.propTypes = {
  onChange: PropTypes.func,
  onClick: PropTypes.func,
};

export default Select;

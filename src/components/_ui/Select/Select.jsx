import React from 'react';
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

export default Select;

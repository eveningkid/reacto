import React from 'react';
import keycodes from 'keycodes';
import './Input.css';

function Input(props) {
  const { onPressEnter, onClick, ...otherProps } = props;
  let handleKeyDown = undefined;
  let handleOnClick;

  if (onPressEnter) {
    handleKeyDown = event => {
      const keycode = keycodes(event.keyCode);
      if (keycode === 'enter') {
        onPressEnter(event);
      }
    };
  }

  if (onClick) {
    handleOnClick = event => {
      event.stopPropagation();
      event.target.select();
      onClick(event);
    };
  } else {
    handleOnClick = event => {
      event.stopPropagation();
      event.target.select();
    };
  }

  return (
    <input
      className="Input"
      onKeyDown={handleKeyDown}
      onClick={handleOnClick}
      {...otherProps}
    />
  );
}

export default Input;

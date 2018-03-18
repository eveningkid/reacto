import React from 'react';
import classNames from 'classnames';
import './Button.css';

function Button(props) {
  const { className, light, small, ...otherProps } = props;
  const classes = classNames('Button', className, {
    light: light ? true : false,
    small: small ? true : false,
  });
  return <button className={classes} {...otherProps} />;
}

export default Button;

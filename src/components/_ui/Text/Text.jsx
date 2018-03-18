import React from 'react';
import classNames from 'classnames';
import './Text.css';

function Text(props) {
  const { light, ...otherProps } = props;
  const classes = classNames('Text', {
    light: light ? true : false, 
  });
  return <p className={classes} {...otherProps} />;
}

export default Text;

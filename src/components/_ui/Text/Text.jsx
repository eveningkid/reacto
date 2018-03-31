import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import './Text.css';

function Text(props) {
  const { light, ...otherProps } = props;
  const classes = classNames('Text', {
    light: light ? true : false,
  });
  return <p className={classes} {...otherProps} />;
}

Text.propTypes = {
  light: PropTypes.bool,
};

export default Text;

import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import './Alert.css';

function Alert(props) {
  const { actionText, children, warning, ...otherProps } = props;
  const classes = classNames('Alert', {
    warning: warning ? true : false,
  });
  return (
    <div className={classes} {...otherProps}>
      <span className="text">{children}</span>
      {actionText && <span className="action">{actionText}</span>}
    </div>
  );
}

Alert.propTypes = {
  actionText: PropTypes.string,
  children: PropTypes.array,
  warning: PropTypes.bool,
};

export default Alert;

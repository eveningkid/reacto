import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import './List.css';

function List(props) {
  let { children, noItems, ...otherProps } = props;

  if (!children.length && noItems) {
    children = noItems;
  }

  return (
    <ul className="List" {...otherProps}>
      {children}
    </ul>
  );
}

List.propTypes = {
  children: PropTypes.arrayOf(PropTypes.element),
  noItems: PropTypes.element,
};

function ListEntry(props) {
  const { checked, disabled, onCheck, ...otherProps } = props;
  const hasChecked = typeof checked !== 'undefined';
  const classes = classNames('ListEntry', {
    'can-be-checked': hasChecked || onCheck,
    checked: hasChecked ? checked : false,
    disabled: disabled ? true : false,
  });
  const onClick = onCheck || undefined;
  return <li className={classes} onClick={onClick} {...otherProps} />;
}

ListEntry.propTypes = {
  checked: PropTypes.bool,
  disabled: PropTypes.bool,
  onCheck: PropTypes.func,
};

List.Entry = ListEntry;

export default List;

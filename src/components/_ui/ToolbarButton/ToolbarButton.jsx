import React from 'react';
// import PropTypes from 'prop-types';
import { Icon } from 'antd';
import classNames from 'classnames';
import './ToolbarButton.css';

class ToolbarButton extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    if (this.props.onClick) {
      this.props.onClick(this.element);
    }
  }

  render() {
    const {
      active,
      children,
      dropdown,
      loaded,
      loading,
      ...otherProps
    } = this.props;
    const classes = classNames('ToolbarButton', {
      active: active ? true : false,
    });
    return (
      <div
        ref={element => (this.element = element)}
        {...otherProps}
        onClick={this.handleClick}
        className={classes}
      >
        {children}
        {dropdown && <Icon type="down" />}
        {(loaded || loading) && (
          <div className="loaded">
            {loaded && (
              <div className="progress" style={{ width: `${loaded}%` }} />
            )}
            {loading && <div className="progress undetermined" />}
          </div>
        )}
      </div>
    );
  }
}

ToolbarButton.propTypes = {};

export default ToolbarButton;

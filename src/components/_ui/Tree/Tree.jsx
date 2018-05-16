import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Icon } from 'antd';
import './Tree.css';

class TreeNode extends React.Component {
  static propTypes = {
    children: PropTypes.array,
    className: PropTypes.string,
    title: PropTypes.string.isRequired,
    onContextMenu: PropTypes.func,
    onSelect: PropTypes.func,
    openedPaths: PropTypes.arrayOf(PropTypes.string),
    path: PropTypes.string.isRequired,
  };

  state = {
    isOpened: TreeNode.isOpened(this.props),
  };

  static isOpened(props) {
    return props.openedPaths.indexOf(props.path) !== -1;
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const isOpened = TreeNode.isOpened(nextProps);
    if (isOpened !== prevState.isOpened) {
      return {
        isOpened,
      };
    }
    return null;
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (
      nextState.isOpened !== this.state.isOpened ||
      nextProps.className !== this.props.className ||
      this.props.children
    ) {
      return true;
    }
    return false;
  }

  isDirectory = () => this.props.children || false;

  onClick = event => {
    event.stopPropagation();
    const isDirectory = this.isDirectory();
    this.props.onSelect(isDirectory, this.props.path);
  };

  onDoubleClick = event => {
    event.stopPropagation();
    const isDirectory = this.isDirectory();
    this.props.onSelect(isDirectory, this.props.path, true);
  };

  render() {
    const isDirectory = this.isDirectory();

    const children = Tree.mapPropsToChildren(this, this.props.children, {
      onSelect: this.props.onSelect,
      openedPaths: this.props.openedPaths,
    });

    let classes = classNames('TreeNode', {
      'is-directory': isDirectory,
      'is-file': !isDirectory,
    });

    if (this.props.className) {
      classes += ' ' + this.props.className;
    }

    const optionalProps = {};
    if (this.props.onContextMenu) {
      optionalProps.onContextMenu = this.props.onContextMenu;
    }

    return (
      <li
        onClick={this.onClick}
        onDoubleClick={this.onDoubleClick}
        className={classes}
        {...optionalProps}
      >
        {isDirectory && (
          <Icon
            type={this.state.isOpened ? 'minus' : 'plus'}
            style={{ fontSize: 11 }}
          />
        )}

        {this.props.title}
        {this.state.isOpened && isDirectory && <ul>{children}</ul>}
      </li>
    );
  }
}

class Tree extends React.Component {
  static TreeNode = TreeNode;
  static propTypes = {
    children: PropTypes.arrayOf(PropTypes.element),
    onSelect: PropTypes.func,
  };
  static mapPropsToChildren = (context, children, props) => {
    if (!children) children = [];
    children = children.filter(child => child !== null);
    return React.Children.map(
      children,
      child => {
        return React.cloneElement(child, props);
      },
      context
    );
  };

  state = { openedPaths: [] };

  onSelect = (isDirectory, path, event) => {
    if (isDirectory) {
      let openedPaths = this.state.openedPaths;

      const index = openedPaths.indexOf(path);

      if (index !== -1) {
        openedPaths.splice(index, 1);
      } else {
        openedPaths.push(path);
      }

      this.setState({ openedPaths });
    } else {
      this.props.onSelect(path, event);
    }
  };

  render() {
    const children = Tree.mapPropsToChildren(this, this.props.children, {
      onSelect: this.onSelect,
      openedPaths: this.state.openedPaths,
    });

    return (
      <div className="Tree">
        <ul>{children}</ul>
      </div>
    );
  }
}

export default Tree;

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { selectCompilerMenu } from '../../menus';
import { ToolbarButton } from '../_ui';

/**
 * 'Compiler' popover.
 */
class Compiler extends React.Component {
  static options = [
    { label: 'Babel (default)', value: 'babel' },
    { label: 'Flow', value: 'flow' },
    // TODO that would be nice, right? :)
    // { label: 'TypeScript', value: 'typescript' },
  ];

  static propTypes = {
    compiler: PropTypes.string,
  };

  render() {
    return (
      <ToolbarButton
        dropdown
        onClick={element => {
          selectCompilerMenu.open(
            {
              options: Compiler.options,
              compiler: this.props.compiler,
            },
            {
              x: element.offsetLeft,
              y: element.parentElement.offsetHeight,
            }
          );
        }}
      >
        Compiler
      </ToolbarButton>
    );
  }
}

const mapStateToProps = state => ({
  compiler: state.project.compiler,
});

export default connect(mapStateToProps)(Compiler);

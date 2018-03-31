import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Popover, Radio } from 'antd';

/**
 * 'Compiler' popover.
 */
class Compiler extends React.Component {
  static propTypes = {
    compiler: PropTypes.string,
    updateCompiler: PropTypes.func,
  };

  state = { isBusy: false };

  renderPopover() {
    const options = [
      { label: 'Babel (default)', value: 'babel' },
      { label: 'Flow', value: 'flow' },
      // TODO that would be nice, right? :)
      // { label: 'TypeScript', value: 'typescript' },
    ];

    const radioStyle = {
      display: 'block',
    };

    return (
      <Radio.Group
        onChange={event => this.props.updateCompiler(event.target.value)}
        value={this.props.compiler}
      >
        {options.map((option, i) => (
          <Radio key={i} style={radioStyle} value={option.value}>
            {option.label}
          </Radio>
        ))}
      </Radio.Group>
    );
  }

  render() {
    return (
      <div>
        <Popover
          placement="bottom"
          content={this.renderPopover()}
          trigger="click"
          onVisibleChange={isOpened => this.setState({ isOpened })}
        >
          Compiler
        </Popover>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  compiler: state.project.compiler,
});

const mapDispatchToProps = dispatch => ({
  updateCompiler: compiler => dispatch.project.updateCompiler({ compiler }),
});

export default connect(mapStateToProps, mapDispatchToProps)(Compiler);

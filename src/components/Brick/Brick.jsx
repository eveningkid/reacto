import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Icon } from 'antd';
import BrickType from '../../bricks/baseBrick';
import './Brick.css';

/**
 * Represent a Brick, the ones on the right side of the editor.
 * Will then be wrapped inside <Components />
 */
class Brick extends React.Component {
  static propTypes = {
    brick: PropTypes.instanceOf(BrickType),
    removeBrick: PropTypes.func,
  };

  componentDidMount() {
    this.props.brick.parentRenderer = this;
  }

  handleRemove = () => {
    this.props.removeBrick(this.props.brick.id);
  };

  render() {
    const { brick } = this.props;
    const Renderer = brick.renderer;
    const rendererProps = brick.rendererProps();

    return (
      <div className="Brick">
        <header>
          <h1>{brick.name}</h1>
          <Icon type="close" onClick={this.handleRemove} />
        </header>

        <div className="ui">
          <Renderer
            ref={element => (this.brickRenderer = element)}
            parent={brick}
            state={rendererProps}
          />
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  removeBrick: id => dispatch.session.removeBrick({ id }),
});

export default connect(null, mapDispatchToProps)(Brick);

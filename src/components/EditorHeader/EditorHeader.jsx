import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { Icon, Layout } from 'antd';
import { Compiler, Configurator, PackageManager, RecipesPicker } from '..';
import { ToolbarButton, ToolbarButtonGroup } from '../_ui';
import './EditorHeader.css';

/**
 * Upper part of the editor.
 * Show handy links.
 */
class EditorHeader extends React.Component {
  static propTypes = {
    currentFileHasUnsavedChanges: PropTypes.bool,
    switchProject: PropTypes.func,
  };

  handleBack = () => {
    this.props.switchProject(null);
  };

  renderUnsavedChanges() {
    const classes = classNames('unsaved-changes', {
      show: this.props.currentFileHasUnsavedChanges,
    });

    return <div className={classes}>Unsaved Changes</div>;
  }

  render() {
    return (
      <Layout.Header className="EditorHeader">
        <div className="back" onClick={this.handleBack}>
          Open another project
        </div>

        <nav>
          {this.renderUnsavedChanges()}
          <RecipesPicker />
          <ToolbarButtonGroup>
            <Compiler />
            <PackageManager />
          </ToolbarButtonGroup>
          <ToolbarButtonGroup>
            <ToolbarButton
              active={!this.props.ui.isFileTreeOpened}
              onClick={this.props.toggleIsFileTreeOpened}
              title="Toggle File Tree"
            >
              <Icon type="menu-fold" className="no-margin" />
            </ToolbarButton>
            <ToolbarButton
              active={!this.props.ui.isBrickSelectorOpened}
              onClick={this.props.toggleIsBrickSelectorOpened}
              title="Toggle Brick Selector"
            >
              <Icon type="menu-unfold" className="no-margin" />
            </ToolbarButton>
          </ToolbarButtonGroup>
          <Configurator />
        </nav>
      </Layout.Header>
    );
  }
}

const mapStateToProps = state => ({
  currentFileHasUnsavedChanges:
    state.session.currentSession.currentFileHasUnsavedChanges,
  ui: state.ui,
});

const mapDispatchToProps = dispatch => ({
  switchProject: cwd => dispatch.project.switchProject(cwd),
  toggleIsBrickSelectorOpened: () => dispatch.ui.toggleIsBrickSelectorOpened(),
  toggleIsFileTreeOpened: () => dispatch.ui.toggleIsFileTreeOpened(),
});

export default connect(mapStateToProps, mapDispatchToProps)(EditorHeader);

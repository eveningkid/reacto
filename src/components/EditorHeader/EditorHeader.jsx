import React from 'react';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { Icon, Layout } from 'antd';
import { Compiler, Configurator, PackageManager, RecipesPicker } from '..';
import { ParentProcessManager } from '../../editor/managers';
import './EditorHeader.css';

/**
 * Upper part of the editor.
 * Show handy links.
 */
class EditorHeader extends React.Component {
  handleBack = () => {
    this.props.switchProject(null);
  }

  renderUnsavedChanges() {
    let hasUnsavedChanges = false;

    if (this.props.originalCode !== this.props.currentCode) {
      hasUnsavedChanges = true;
    }

    const classes = classNames('unsaved-changes', {
      'show': hasUnsavedChanges,
    });

    ParentProcessManager.send(
      ParentProcessManager.actions.UPDATE_UNSAVED_CHANGES_STATUS,
      hasUnsavedChanges
    );

    return <div className={classes}>Unsaved Changes</div>;
  }

  render() {
    return (
      <Layout.Header className="EditorHeader">
        <Icon type="left" className="back" onClick={this.handleBack} />

        <nav>
          {this.renderUnsavedChanges()}
          <RecipesPicker />
          <Compiler />
          <PackageManager />
          <Configurator />
        </nav>
      </Layout.Header>
    );
  }
}

const mapStateToProps = state => ({
  originalCode: state.session.currentSession.originalCode,
  currentCode: state.session.currentSession.code,
});

const mapDispatchToProps = dispatch => ({
  switchProject: cwd => dispatch.project.switchProject(cwd),
});

export default connect(mapStateToProps, mapDispatchToProps)(EditorHeader);

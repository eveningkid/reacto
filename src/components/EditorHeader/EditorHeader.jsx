import React from 'react';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { Layout } from 'antd';
import { Compiler, Configurator, PackageManager, RecipesPicker } from '..';
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
    const classes = classNames('unsaved-changes', {
      'show': this.props.currentFileHasUnsavedChanges,
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
          <Compiler />
          <PackageManager />
          <Configurator />
        </nav>
      </Layout.Header>
    );
  }
}

const mapStateToProps = state => ({
  currentFileHasUnsavedChanges: state.session.currentSession.currentFileHasUnsavedChanges,
});

const mapDispatchToProps = dispatch => ({
  switchProject: cwd => dispatch.project.switchProject(cwd),
});

export default connect(mapStateToProps, mapDispatchToProps)(EditorHeader);

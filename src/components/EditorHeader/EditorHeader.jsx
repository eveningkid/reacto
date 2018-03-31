import React from 'react';
import PropTypes from 'prop-types';
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
          <Compiler />
          <PackageManager />
          <Configurator />
        </nav>
      </Layout.Header>
    );
  }
}

const mapStateToProps = state => ({
  currentFileHasUnsavedChanges:
    state.session.currentSession.currentFileHasUnsavedChanges,
});

const mapDispatchToProps = dispatch => ({
  switchProject: cwd => dispatch.project.switchProject(cwd),
});

export default connect(mapStateToProps, mapDispatchToProps)(EditorHeader);

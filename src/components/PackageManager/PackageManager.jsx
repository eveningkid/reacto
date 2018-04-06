import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { ToolbarButton } from '../_ui';
import PackageManagerRenderer from '../../tools/package-managers/_base/package-manager-renderer';
import PackageManagerType from '../../tools/package-managers/_base/package-manager';
import './PackageManager.css';

/**
 * Display the current running package manager.
 */
class PackageManager extends React.Component {
  static propTypes = {
    packageManager: PropTypes.instanceOf(PackageManagerType),
  };

  state = {
    loading: false,
  };

  handleBusy = () => this.setState({ loading: true });

  handleIdle = () => this.setState({ loading: false });

  render() {
    const packageManager = this.props.packageManager;
    if (!packageManager) return null;

    return (
      <ToolbarButton loading={this.state.loading}>
        <div className="PackageManager">
          <PackageManagerRenderer
            packageManager={packageManager}
            onBusy={this.handleBusy}
            onIdle={this.handleIdle}
          />
        </div>
      </ToolbarButton>
    );
  }
}

const mapStateToProps = state => ({
  packageManager: state.project.packageManager,
});

export default connect(mapStateToProps)(PackageManager);

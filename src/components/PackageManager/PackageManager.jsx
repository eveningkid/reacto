import React from 'react';
import { connect } from 'react-redux';
import PackageManagerRenderer from '../../tools/package-managers/_base/package-manager-renderer';
import './PackageManager.css';

/**
 * Display the current running package manager.
 */
class PackageManager extends React.Component {
  render() {
    const packageManager = this.props.packageManager;

    if (!packageManager) {
      return null;
    }

    return (
      <div className="PackageManager">
        <PackageManagerRenderer packageManager={packageManager} />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  packageManager: state.project.packageManager,
});

export default connect(mapStateToProps)(PackageManager);

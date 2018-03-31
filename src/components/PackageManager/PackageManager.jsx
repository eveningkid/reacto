import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
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

  render() {
    const packageManager = this.props.packageManager;

    if (!packageManager) return null;

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

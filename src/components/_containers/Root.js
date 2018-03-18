import React from 'react';
import { getPersistor } from '@rematch/persist';
import { connect, Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/es/integration/react';
import { EditorWrapper, OpenProject } from '.';

/**
 * Root component. Will decide whether to display the code editor or the
 * project picker.
 */
class Root extends React.Component {
  constructor(props) {
    super(props);
    this.state = { blockRedirect: false };
  }

  componentWillReceiveProps(nextProps) {
    // If this isn't set, and if "startup.openLastOpenedProject" is set to true,
    // then OpenProject will automatically redirect to the last opened project.
    // This behavior should only happen on startup. This is why here we need to
    // specify that we don't want any redirection.
    if (nextProps.cwd !== this.props.cwd) {
      this.setState({ blockRedirect: true });
    }
  }

  render() {
    const persistor = getPersistor();

    return (
      <Provider store={this.props.store}>
        <PersistGate persistor={persistor}>
          {this.props.cwd ?
            <EditorWrapper /> :
            <OpenProject blockRedirect={this.state.blockRedirect} />
          }
        </PersistGate>
      </Provider>
    );
  }
}

const mapStateToProps = state => ({
  cwd: state.project.cwd,
});

export default connect(mapStateToProps)(Root);

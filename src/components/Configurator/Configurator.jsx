import React from 'react';
import key from 'uniqid';
import { Popover } from 'antd';
import { Container, List } from '../_ui';
import config from '../../config';
import './Configurator.css';

/**
 * Editor configuration popover.
 */
class Configurator extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isSaving: false,
    };

    this.options = {
      notifications: [
        { name: 'Silent notifications', path: 'notifications.shouldBeSilent' },
        { name: 'Block notifications', path: 'notifications.blocked' },
      ],
      startup: [
        { name: 'Open last opened project', path: 'startup.openLastOpenedProject' },
      ],
    };
  }

  handleUpdateConfiguration(key, value) {
    this.setState({ isSaving: true }, () => {
      const currentValue = config()._get(key);
      config()._set(key, !currentValue);
      this.setState({ isSaving: false });
    });
  }

  renderOption(configuration, option) {
    const [category, subsection] = option.path.split('.');
    const optionStatus = configuration[category][subsection];

    return (
      <List.Entry
        key={key()}
        checked={optionStatus}
        onCheck={this.handleUpdateConfiguration.bind(this, option.path)}
        disabled={this.state.isSaving}
      >
        {option.name}
      </List.Entry>
    );
  }

  renderOptions(title, options, configuration) {
    return (
      <Container>
        <h1>{title}</h1>
        <List>{options.map(this.renderOption.bind(this, configuration))}</List>
      </Container>
    );
  }

  renderPopover() {
    const configuration = config();

    return (
      <React.Fragment>
        {this.renderOptions('Notifications', this.options.notifications, configuration)}
        {this.renderOptions('On Startup', this.options.startup, configuration)}
      </React.Fragment>
    );
  }

  render() {
    return (
      <div className="ConfiguratorContainer">
        <Popover
          overlayClassName="Configurator"
          placement="bottom"
          content={this.renderPopover()}
          trigger="click"
          onVisibleChange={(isOpened) => this.setState({ isOpened })}
        >
          Settings
        </Popover>
      </div>
    );
  }
}

export default Configurator;

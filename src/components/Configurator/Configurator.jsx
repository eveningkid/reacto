import React from 'react';
import key from 'uniqid';
import { Popover } from 'antd';
import { Container, Input, List, Select } from '../_ui';
import { EventsManager, FormatterManager } from '../../editor/managers';
import config, { custom } from '../../config';
import './Configurator.css';

/**
 * Editor configuration popover.
 */
class Configurator extends React.Component {
  state = {
    isOpened: false,
  };

  componentDidMount() {
    EventsManager.on('toggle-settings', () => {
      this.setState({ isOpened: !this.state.isOpened });
    });
  }

  handleUpdateConfiguration = (key, value) => {
    if (key.includes('prettier')) {
      FormatterManager.updateConfiguration(key, value);
    }
    config()._set(key, value);
    this.forceUpdate();
  };

  renderOption = option => {
    const optionStatus = config()._get(option.path);

    switch (option.type) {
      case 'select':
        return (
          <List.Entry key={key()}>
            <p>{option.name}</p>
            <Select
              value={optionStatus}
              onChange={newValue =>
                this.handleUpdateConfiguration(option.path, newValue)
              }
            >
              {option.options.map(subOption => (
                <Select.Option key={key()} value={subOption}>
                  {subOption}
                </Select.Option>
              ))}
            </Select>
          </List.Entry>
        );

      case 'number':
        return (
          <List.Entry key={key()}>
            <p>{option.name}</p>
            <Input
              type="number"
              min={0}
              value={optionStatus}
              onChange={event =>
                this.handleUpdateConfiguration(option.path, event.target.value)
              }
            />
          </List.Entry>
        );

      // Boolean by default
      default:
        return (
          <List.Entry
            key={key()}
            checked={optionStatus}
            onCheck={this.handleUpdateConfiguration.bind(
              this,
              option.path,
              !optionStatus
            )}
          >
            {option.name}
          </List.Entry>
        );
    }
  };

  renderOptions = (title, options) => {
    return (
      <Container key={key()}>
        <h1>{title}</h1>
        <List>{options.map(this.renderOption)}</List>
      </Container>
    );
  };

  renderPopover = () => {
    return (
      <div className="ConfiguratorContent">
        {Object.entries(custom).map(([title, options]) =>
          this.renderOptions(title, options)
        )}
      </div>
    );
  };

  render() {
    return (
      <div className="ConfiguratorContainer">
        <Popover
          overlayClassName="Configurator"
          placement="bottomRight"
          content={this.renderPopover()}
          trigger="click"
          visible={this.state.isOpened}
          onVisibleChange={isOpened => this.setState({ isOpened })}
        >
          Preferences
        </Popover>
      </div>
    );
  }
}

export default Configurator;

import React from 'react';
import key from 'uniqid';
import { Popover } from 'antd';
import { Container, Input, List, Select } from '../_ui';
import config from '../../config';
import './Configurator.css';

/**
 * Editor configuration popover.
 */
class Configurator extends React.Component {
  constructor(props) {
    super(props);
    this.options = {
      editor: [{ name: 'Vim Mode', path: 'editor.vim' }],
      notifications: [
        { name: 'Silent notifications', path: 'notifications.shouldBeSilent' },
        { name: 'Block notifications', path: 'notifications.blocked' },
      ],
      startup: [
        { name: 'Open last opened project', path: 'startup.openLastOpenedProject' },
      ],
      formatter: [
        { name: 'Format on save', path: 'formatter.formatOnSave' },
      ],
      prettier: [
        { name: 'Tab width', path: 'prettier.config.tabWidth', type: 'number' },
        { name: 'Use tabs', path: 'prettier.config.tabWidth' },
        { name: 'Semicolons', path: 'prettier.config.semi' },
        { name: 'Replace double quotes with single', path: 'prettier.config.singleQuote' },
        {
          name: 'Trailing commas',
          path: 'prettier.config.trailingComma',
          type: 'select',
          options: ['none', 'es5', 'all'],
        },
        { name: 'Bracket Spacing', path: 'prettier.config.bracketSpacing' },
        { name: 'JSX Brackets', path: 'prettier.config.jsxBracketSameLine' },
        {
          name: 'Arrow Function Parentheses',
          path: 'prettier.config.arrowParens',
          type: 'select',
          options: ['avoid', 'always'],
        },
        {
          name: 'Prose Wrap',
          path: 'prettier.config.proseWrap',
          type: 'select',
          options: ['preserve', 'always', 'never'],
        },
      ],
    };
  }

  handleUpdateConfiguration = (key, value) => {
    config()._set(key, value);
    this.forceUpdate();
  }

  renderOption = (option) => {
    const optionStatus = config()._get(option.path);

    switch (option.type) {
      case 'select':
        return (
          <List.Entry key={key()}>
            <p>{option.name}</p>
            <Select
              value={optionStatus}
              onChange={newValue => this.handleUpdateConfiguration(option.path, newValue)}
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
              onChange={event => this.handleUpdateConfiguration(option.path, event.target.value)}
            />
          </List.Entry>
        );

      // Boolean by default
      default:
        return (
          <List.Entry
            key={key()}
            checked={optionStatus}
            onCheck={this.handleUpdateConfiguration.bind(this, option.path, !optionStatus)}
          >
            {option.name}
          </List.Entry>
        );
    }
  }

  renderOptions = (title, options) => {
    return (
      <Container key={key()}>
        <h1>{title}</h1>
        <List>{options.map(this.renderOption)}</List>
      </Container>
    );
  }

  renderPopover = () => {
    return (
      <div className="ConfiguratorContent">
        {Object.entries(this.options).map(([title, options]) =>
          this.renderOptions(title, options)
        )}
      </div>
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
          onVisibleChange={isOpened => this.setState({ isOpened })}
        >
          Settings
        </Popover>
      </div>
    );
  }
}

export default Configurator;

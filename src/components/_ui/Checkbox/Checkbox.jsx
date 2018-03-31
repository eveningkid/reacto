import React from 'react';
import PropTypes from 'prop-types';
import key from 'uniqid';
import './Checkbox.css';

class CheckboxGroup extends React.Component {
  static propTypes = {
    checked: PropTypes.bool,
    label: PropTypes.any,
    onChange: PropTypes.func,
    options: PropTypes.array,
    value: PropTypes.any,
  };

  onChange = value => {
    let options = this.props.value;
    const optionIndex = options.indexOf(value);

    if (optionIndex !== -1) {
      options.splice(optionIndex, 1);
    } else {
      options.push(value);
    }

    this.props.onChange(options);
  };

  render() {
    return (
      <div className="CheckboxGroup">
        {this.props.options.map(({ label, value }) => (
          <Checkbox
            key={key()}
            checked={this.props.value.includes(value)}
            onChange={this.onChange.bind(this, value)}
            label={label}
          />
        ))}
      </div>
    );
  }
}

class Checkbox extends React.Component {
  static Group = CheckboxGroup;
  static propTypes = {
    checked: PropTypes.bool,
    label: PropTypes.any,
    onChange: PropTypes.func,
  };

  onChange = () => {
    this.props.onChange(this.checkbox.checked);
  };

  render() {
    return (
      <div className="Checkbox">
        <input
          ref={element => (this.checkbox = element)}
          type="checkbox"
          name="checkbox"
          checked={this.props.checked}
          onChange={this.onChange}
        />

        <label htmlFor="checkbox" onClick={this.onChange}>
          {this.props.label}
        </label>
      </div>
    );
  }
}

export default Checkbox;

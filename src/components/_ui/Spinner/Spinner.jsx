import React from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'antd';
import './Spinner.css';

function Spinner(props) {
  return (
    <div className="Spinner">
      <Icon type="loading" />
      {props.text && <p>{props.text}</p>}
    </div>
  );
}

Spinner.propTypes = {
  text: PropTypes.string,
};

export default Spinner;

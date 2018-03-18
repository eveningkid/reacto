import React from 'react';
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

export default Spinner;

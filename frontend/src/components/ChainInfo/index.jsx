// Vendor imports
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
// Project imports
// Component imports
import strings from './strings.js';
import './styles.css';

class ChainInfo extends Component {
  constructor(props) {
    super(props);

    this.onClick = this.onClick.bind(this);
  }

  render() {
    const {props: {name, transfer, balance, sender}} = this;
    const remaining = sender ? Number(balance) - Number(transfer) : Number(balance) + Number(transfer);
    const source = classNames('ChainInfo', {'Source': sender});
    return (
        <div className={source}
          onClick={this.onClick}>
            <h2>{name}</h2>
            <p>{strings.current}{balance}</p>
            <p>{strings.adjusted}{remaining}</p>
        </div>
    )
  }

  onClick() {
    const {props: {onClick}} = this;
    if (onClick) {
      onClick();
    }
  }

}

ChainInfo.proptypes = {
  onClick: PropTypes.func,
  balance: PropTypes.number,
  name: PropTypes.string,
  sender: PropTypes.bool,
  transfer: PropTypes.number,
}
export default ChainInfo;
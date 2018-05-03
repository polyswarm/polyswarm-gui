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
    const source = classNames('Balance',{'Sender': sender});
    return (
        <div className='ChainInfo'
          onClick={this.onClick}>
          <h3>{name}</h3>
          <p>{strings.current}</p>
          <p>{balance}</p>
          <p>{strings.adjusted}</p>
          <p className={source}>{remaining}</p>
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
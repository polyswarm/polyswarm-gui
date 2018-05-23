// Vendor imports
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import BigNumber from 'bignumber.js';
import Uuid from 'uuid/v4';
import {CSSTransition} from 'react-transition-group';
// Bounty imports
import AnimatedInput from '../AnimatedInput';
import Button from '../Button';
// Component imports
import HttpOffer from './http';
import strings from './strings';

class ModalPay extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      unlocking: false,
      password_error: null,
      password: '',
      amount: '0',
      amount_error: null,
    };

    this.onChangeAmount = this.onChangeAmount.bind(this);
    this.onChangePassword = this.onChangePassword.bind(this);
    this.onCloseClick = this.onCloseClick.bind(this);
    this.onKeyPress = this.onKeyPress.bind(this);
    this.onPayClick = this.onPayClick.bind(this);
    this.open = this.open.bind(this);
    this.close = this.close.bind(this);
    this.addAccountRequest = this.addAccountRequest.bind(this);
    this.removeAccountRequest = this.removeAccountRequest.bind(this);
  }

  render() {
    const { props: { author, expert, nct, eth } } = this;
    const {
      state: { open, unlocking, password_error, password, amount_error, amount }
    } = this;
    return (
      <div className='Modal'>
        <CSSTransition
          in={open}
          timeout={300}
          mountOnEnter
          unmountOnExit
          classNames='open'>
          {state => (
            <React.Fragment>
              <div key='background' className='ModalBackground' onClick={this.onCloseClick}/>
              <CSSTransition
                in={open && state !== 'exited'}
                timeout={300}
                unmountOnExit
                classNames='slide'>
                {() => (
                  <div className='ModalContent' key='content'>
                    <header className='ModalContentHeader'>
                      {strings.pay}
                    </header>
                    <form>
                      <AnimatedInput input_id='from'
                        readonly={author}
                        placeholder={strings.author}
                        type='text'/>
                      <AnimatedInput input_id='to'
                        readonly={expert}
                        placeholder={strings.expert}
                        type='text'/>
                      <AnimatedInput input_id='nectar'
                        readonly={nct}
                        placeholder={strings.nectar}
                        type='number'/>
                      <AnimatedInput input_id='eth'
                        readonly={eth}
                        placeholder={strings.eth}
                        type='number'/>
                      <AnimatedInput input_id='amount'
                        value={amount}
                        onChange={this.onChangeAmount}
                        error={amount_error}
                        placeholder={strings.amount}
                        type='number'/>
                      <AnimatedInput input_id='password'
                        value={password}
                        onChange={this.onChangePassword}
                        error={password_error}
                        placeholder={strings.password}
                        onKeyPress={this.onKeyPress}
                        type='password'/>
                    </form>
                    <p className='ModalMessage'>{strings.background}</p>
                    <span className='Modal-Button-Bar'>
                      <Button flat
                        disabled={unlocking} 
                        onClick={this.onPayClick}>
                        {strings.pay}
                      </Button>
                      <Button
                        flat
                        cancel
                        disabled={unlocking}
                        onClick={this.onCloseClick}>
                        {strings.cancel}
                      </Button>
                    </span>
                  </div>
                )}
              </CSSTransition>
            </React.Fragment>
          )}
        </CSSTransition>
      </div>
    );
  }

  onChangeAmount(event) {
    const amount = event.target.value;
    const { props: { currentPayment } } = this;
    if (amount < currentPayment) {
      const errorMessage = `${strings.too_low}${currentPayment}`;
      this.setState({amount_error: errorMessage});
    }
  }

  onChangePassword(event) {
    this.setState({ password: event.target.value });
  }

  onCloseClick() {
    const { state: { unlocking } } = this;
    if (!unlocking) {
      this.close();
    }
  }

  onKeyPress(e) {
    if (e.key == 'Enter') {
      e.preventDefault();
      this.onPayClick();
    }
  }

  onPayClick() {
    const { props: { url, address } } = this;
    const {state: {password, amount}} = this;
    this.setState({ unlocking: true, error: false });

    const http = new HttpOffer(url);
    const uuid = Uuid();
    const amountWei = new BigNumber(amount).times(new BigNumber('1000000000000000000'));
    this.addAccountRequest(strings.pay, uuid);
    return http.unlockWallet(address, password)
      .then(success => {
        if (success) {
          return http.pay(amountWei);
        } else {
          this.setState({password_error: strings.incorrect});
        }
      })
      .then(() => {
        this.removeAccountRequest(strings.requestUnlockWallet, uuid);
      });
  }

  open() {
    this.setState({ open: true });
  }

  close() {
    this.setState({ 
      open: false,
      password: ''
    });
  }

  addAccountRequest(title, id) {
    const { addRequest } = this.props;
    if (addRequest) {
      addRequest(title, id);
    }
  }

  removeAccountRequest(title, id) {
    const { removeRequest } = this.props;
    if (removeRequest) {
      removeRequest(title, id);
    }
  }
}

ModalPay.proptypes = {
  url: PropTypes.string,
  addRequest: PropTypes.func,
  removeRequest: PropTypes.func,
  author: PropTypes.string,
  expert: PropTypes.string,
  nct: PropTypes.number,
  eth: PropTypes.number,
};
export default ModalPay;

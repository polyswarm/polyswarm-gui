// Vendor imports
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Uuid from 'uuid/v4';
import {CSSTransition} from 'react-transition-group';
// Bounty imports
import AnimatedInput from '../AnimatedInput';
import Button from '../Button';
// Component imports
import HttpAccount from './http';
import strings from './strings';

class ModalPassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      unlocking: false,
      password_error: null,
      password: '',
      address: 0,
    };

    this.onWalletChangeHandler = this.onWalletChangeHandler.bind(this);
    this.onChangePassword = this.onChangePassword.bind(this);
    this.onChangeAddress = this.onChangeAddress.bind(this);
    this.onCloseClick = this.onCloseClick.bind(this);
    this.onKeyPress = this.onKeyPress.bind(this);
    this.onUnlockClick = this.onUnlockClick.bind(this);
    this.unlockWallet = this.unlockWallet.bind(this);
    this.createWallet = this.createWallet.bind(this);
    this.open = this.open.bind(this);
    this.close = this.close.bind(this);
    this.addAccountRequest = this.addAccountRequest.bind(this);
    this.removeAccountRequest = this.removeAccountRequest.bind(this);
  }

  componentDidMount() {
    const { props: { address } } = this;
    this.setState({address: address});
  }

  render() {
    const { props: { walletList } } = this;
    const {
      state: { open, unlocking, password_error, address: address }
    } = this;
    let wallet = {address: '', eth: '0', nct: '0'};
    if (walletList && address >= 0 && walletList.length > address ) {
      wallet = walletList[address];
    }
    return (
      <div className='ModalPassword'>
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
                      {walletList.length > 0 ? strings.header : strings.createHeader}
                    </header>
                    <form>
                      {walletList.length > 0 && (
                        <React.Fragment>
                          <label htmlFor='address'>{strings.address}</label>
                          <select
                            id='address'
                            value={wallet.address}
                            onChange={this.onChangeAddress}>
                            {walletList.map(walletOption => {
                              return (
                                <option key={walletOption.address}
                                  value={walletOption.address}>
                                  {walletOption.address}
                                </option>
                              );
                            })}
                          </select>
                          <AnimatedInput input_id='nectar'
                            readonly={wallet.nct}
                            placeholder={strings.nectar}
                            type='number'/>
                          <AnimatedInput input_id='eth'
                            readonly={wallet.eth}
                            placeholder={strings.eth}
                            type='number'/>
                        </React.Fragment>
                      )}
                      <AnimatedInput input_id='password'
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
                        onClick={this.onUnlockClick}>
                        {walletList.length > 0 ? strings.unlock : strings.create}
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

  onWalletChangeHandler(didUnlock = false) {
    const { props: { onWalletChange }} = this;
    if (onWalletChange) {
      onWalletChange(didUnlock);
    }
  }

  onChangePassword(password) {
    this.setState({ password: password });
  }

  onChangeAddress(event) {
    const { props: { walletList } } = this;
    const value = event.target.value;
    const index = walletList.findIndex(v => v.address === value);
    this.setState({ address: index });
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
      this.onUnlockClick();
    }
  }

  onUnlockClick() {
    const { state: { address, password } } = this;
    const { props: { walletList } } = this;
    let wallet = {address: '', eth: '0', nct: '0'};
    if (walletList && address >= 0 && walletList.length > address ) {
      wallet = walletList[address];
    }
    if (walletList && walletList.length > 0) {
      this.unlockWallet(wallet.address, password);
    } else {
      this.createWallet(password);
    }
  }

  unlockWallet(address, password) {
    const { props: { url } } = this;
    this.setState({ unlocking: true, password_error: null });
    const http = new HttpAccount(url);
    const uuid = Uuid();
    this.addAccountRequest(strings.requestUnlockWallet, uuid);
    return http.unlockWallet(address, password).then(success => {
      if (success) {
        this.setState({unlocking: false, password_error: null});
        this.onWalletChangeHandler(true);
        this.close();
      } else {
        this.setState({unlocking: false, password_error: strings.error});
      }
      this.removeAccountRequest(strings.requestUnlockWallet, uuid);
    });
  }

  createWallet(password) {
    const { props: { url } } = this;
    this.setState({ unlocking: true, password_error: null });
    const http = new HttpAccount(url);
    const uuid = Uuid();
    this.addAccountRequest(strings.requestCreateWallet, uuid);
    return http.createWallet(password).then(success => {
      if (success) {
        this.setState({unlocking: false, password_error: null});
        this.onWalletChangeHandler(false);
        this.close();
      } else {
        this.setState({unlocking: false, password_error: strings.error});
      }
      this.removeAccountRequest(strings.requestCreateWallet, uuid);
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

ModalPassword.proptypes = {
  url: PropTypes.string,
  walletList: PropTypes.array,
  onWalletChange: PropTypes.func,
  addRequest: PropTypes.func,
  removeRequest: PropTypes.func,
  address: PropTypes.number,
};
export default ModalPassword;

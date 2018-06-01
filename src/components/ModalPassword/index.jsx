// Vendor imports
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {CSSTransition} from 'react-transition-group';
// Bounty imports
import AnimatedInput from '../AnimatedInput';
import Button from '../Button';
// Component imports
import strings from './strings';
import FileButton from '../FileButton';

class ModalPassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      password_error: null,
      password: '',
      address: '',
      file: null
    };

    this.onChangePassword = this.onChangePassword.bind(this);
    this.onKeySelected = this.onKeySelected.bind(this);
    this.onFileSelected = this.onFileSelected.bind(this);
    this.onCloseClick = this.onCloseClick.bind(this);
    this.onKeyPress = this.onKeyPress.bind(this);
    this.onUnlockClick = this.onUnlockClick.bind(this);
    this.parseAddress = this.parseAddress.bind(this);
  }

  render() {
    const { state: { password_error, address, file, password }, props: { open } } = this;
    const filename = file ? file.name : strings.na;
    let addr = file ? address : strings.na;
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
                      {strings.header}
                    </header>
                    <form>
                      <FileButton flat
                        onFileSelected={this.onFileSelected}>
                        {strings.selectKeystore}
                      </FileButton>
                      <AnimatedInput input_id='filename'
                        readonly={filename}
                        placeholder={strings.addressFile}
                        type='string'/>
                      <AnimatedInput input_id='address'
                        readonly={addr}
                        placeholder={strings.address}
                        type='string'/>
                      <AnimatedInput input_id='password'
                        onChange={this.onChangePassword}
                        error={password_error}
                        placeholder={strings.password}
                        onKeyPress={this.onKeyPress}
                        type='password'/>
                    </form>
                    <span className='Modal-Button-Bar'>
                      <Button flat
                        disabled={!password || password_error}
                        onClick={this.onUnlockClick}>
                        {strings.unlock}
                      </Button>
                      <Button
                        flat
                        cancel
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

  onKeySelected(keyfile, address, password) {
    const { props: { onKeySelected }} = this;
    if (onKeySelected) {
      onKeySelected(keyfile, address, password);
    }
  }

  onFileSelected(files) {
    if (files.length > 0) {
      const file = files[0];
      this.parseAddress(file)
        .then(address => {
          this.setState({address, file});
        });
    }
  }

  onChangePassword(password) {
    this.setState({ password: password });
    if (!password || password.length == 0) {
      this.setState({password_error: strings.mustHavePw});
    }
  }

  onCloseClick() {
    const { props: { onModalRequestClose } } = this;
    if (onModalRequestClose) {
      onModalRequestClose();
    }
  }

  onKeyPress(e) {
    if (e.key == 'Enter') {
      e.preventDefault();
      this.onUnlockClick();
    }
  }

  onUnlockClick() {
    const { state: { password, file, address } } = this;
    if (password && password.length >= 0 && file && address) {
      this.onKeySelected(file, address, password);
    }
  }

  parseAddress(file) {
    return new Promise((resolve, reject) => {
      require('fs').readFile(file.path, 'utf8', (err, data) => {
        if (err) {
          reject(err);
          return;
        }
        const parsed = JSON.parse(data);

        resolve('0x'+parsed.address);
      });
    });
    
  }
}

ModalPassword.proptypes = {
  open: PropTypes.bool,
  onKeySelected: PropTypes.func,
  onModalRequestClose: PropTypes.func,
};
export default ModalPassword;

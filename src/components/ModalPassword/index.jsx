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
    this.onFilesSelected = this.onFilesSelected.bind(this);
    this.onCloseClick = this.onCloseClick.bind(this);
    this.onKeyPress = this.onKeyPress.bind(this);
    this.onUnlockClick = this.onUnlockClick.bind(this);
    this.parseAddress = this.parseAddress.bind(this);
  }

  render() {
    const { state: { password_error, address, file }, props: { open } } = this;
    const filename = file ? file.name : 'Select a file.';
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
                      <AnimatedInput input_id='filename'
                        readonly={filename}
                        placeholder={strings.address}
                        type='string'/>
                      <FileButton flat
                        onFilesSelected={onFilesSelected}/>
                      {file && (
                        <AnimatedInput input_id='address'
                          readonly={address}
                          placeholder={strings.address}
                          type='string'/>
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
                        disabled={!password || password_error}
                        onClick={this.onUnlockClick}>
                        {walletList.length > 0 ? strings.unlock : strings.create}
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
      onKeySelected(password);
    }
  }

  onFilesSelected(files) {
    if (files.length > 0) {
      const file = file[0];
      const address = this.parseAddress(file);
      this.setState({address, file});
    }
  }

  onChangePassword(password) {
    this.setState({ password: password });
    if (!password || password.length == 0) {
      this.setState({password_error: strings.mustHavePw});
    }
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
    const { state: { password, file, address } } = this;
    if (password && password.length >= 0 && file && address) {
      this.onKeySelected(keyfile, address, password);
    }
  }

  parseAddress(file) {
    
  }
}

ModalPassword.proptypes = {
  open: PropTypes.bool,
  onKeySelected: PropTypes.func,
};
export default ModalPassword;

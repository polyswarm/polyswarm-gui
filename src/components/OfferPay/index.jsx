// Vendor imports
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Uuid from 'uuid/v4';
import BigNumber from 'bignumber.js';
// Offer imports
import AnimatedInput from '../AnimatedInput';
import Button from '../Button';
import Header from '../Header';
import ModalPassword from '../ModalPassword';
// Component imports
import strings from './strings';
import HttpOfferPay from './http';

class OfferPay extends Component {
  constructor(props) {
    super(props);
    this.state = {
      reward_error: null,
      reward: null,
      duration: null,
      duration_error: null,
      expert: null,
      expert_error: null,
    };

    this.payExpert = this.payExpert.bind(this);
    this.addMessage = this.addMessage.bind(this);
    this.onClickHandler = this.onClickHandler.bind(this);
    this.onRewardChanged = this.onRewardChanged.bind(this);
    this.addPayRequest = this.addPayRequest.bind(this);
    this.removePayRequest = this.removePayRequest.bind(this);
    this.validateFields = this.validateFields.bind(this);
    this.onWalletChangeHandler = this.onWalletChangeHandler.bind(this);
  }

  componentDidMount() {
    const { props: { url } } = this;
    this.http = new HttpOfferPay(url);
  }

  render() {
    const { state: { reward, reward_error } } = this;
    const { props: { offer, url, walletList, addRequest, removeRequest,
      requestsInProgress, onBackPressed } } = this;

    const address = walletList.findIndex((wallet) => wallet.address === offer.author);
    const wallet = walletList[address];
    const title = strings.title + offer.expert;
    return (
      <div className='OfferPay'>
        <Header title={title}
          requests={requestsInProgress}
          back={true}
          onBack={onBackPressed}
          address={wallet.address}
          nct={wallet.nct}
          eth={wallet.eth}/>
        <ModalPassword
          ref={modal => (this.modal = modal)}
          url={url}
          walletList={walletList}
          address={address}
          onWalletChange={this.onWalletChangeHandler}
          addRequest={addRequest}
          removeRequest={removeRequest}/>
        <div className='OfferPay-Content'>
          <div className='OfferPay-Center'>
            <h2>{strings.instructions}</h2>
            <AnimatedInput type='number'
              onChange={this.onRewardChanged}
              error={reward_error}
              placeholder={strings.reward}
              input_id='reward'/>
            <div className='OfferPay-Upload'>
              <Button
                disabled={!reward || reward_error}
                onClick={this.onClickHandler}>
                {strings.pay}
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  addMessage(message) {
    const {props: {addMessage}} = this;
    if (addMessage) {
      addMessage(message);
    }
  }
  
  onClickHandler() {
    this.modal.open();
  }
  
  onRewardChanged(reward) {
    this.setState({reward: reward}, () => {
      this.validateFields();
    });
  }
  
  onWalletChangeHandler(didUnlock) {
    const { props: { onWalletChange } } = this;
    if (onWalletChange) {
      onWalletChange();
    }
    if (didUnlock) {
      return this.payExpert();
    } else {
      return null;
    }
  }

  payExpert() {
    const { state: {reward, reward_error}, props: { offer, onBackPressed } } = this;

    const rewardWei = new BigNumber(reward).times(new BigNumber('1000000000000000000'));

    const http = this.http;
    if (reward &&!reward_error) {
      const uuid = Uuid();
      this.addPayRequest(uuid);
      return new Promise(resolve => {
        if (onBackPressed) {
          onBackPressed();
        }
        resolve();
      })
        .then(() => http.pay(offer.guid, rewardWei.toString()))
        .then(result => this.addMessage(result))
        .catch(error => {
          let errorMessage;
          if (!error || !error.message || error.message.length === 0) {
            errorMessage = strings.error;
          } else {
            errorMessage = error.message;
          }
          this.setState({ error: errorMessage });

          //Update app
          const { props: { onWalletChange, onError } } = this;
          if (onWalletChange) {
            onWalletChange(false);
          }
          if (onError) {
            onError(errorMessage);
          }
        })
        .then(() => {
          this.removePayRequest(uuid);
        });
    } else {
      return null;
    }
  }

  addPayRequest(id) {
    const { addRequest } = this.props;
    if (addRequest) {
      addRequest(strings.requestPay, id);
    }
  }

  removePayRequest(id) {
    const { removeRequest } = this.props;
    if (removeRequest) {
      removeRequest(strings.requestPay, id);
    }
  }

  validateFields() {
    const {state: {reward}} = this;
    const {props: {last}} = this;
    const min = new BigNumber('0.0625');
    const lastPay = new BigNumber(last);
    if (reward && new BigNumber(reward).comparedTo(min) < 0 ) {
      this.setState({reward_error: 'Reward below 0.0625 minimum.'});
    } else if (reward && new BigNumber(reward).comparedTo(lastPay) <= 0 ) {
      this.setState({reward_error: `Reward must be higher than last payment of ${lastPay.toString()}.`});
    } else {
      this.setState({reward_error: null});
    }
  }
}

OfferPay.propTypes = {
  walletList: PropTypes.array,
  address: PropTypes.number,
  onError: PropTypes.func,
  onWalletChange: PropTypes.func,
  addOffer: PropTypes.func,
  addRequest: PropTypes.func,
  removeRequest: PropTypes.func,
  url: PropTypes.string,
  last: PropTypes.string,
};
export default OfferPay;

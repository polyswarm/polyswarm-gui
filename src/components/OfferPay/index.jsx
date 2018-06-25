// Vendor imports
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Uuid from 'uuid/v4';
import BigNumber from 'bignumber.js';
import web3Utils from 'web3-utils';
// Offer imports
import AnimatedInput from '../AnimatedInput';
import Button from '../Button';
import Header from '../Header';
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
      expert_error: null
    };

    this.payExpert = this.payExpert.bind(this);
    this.onClickHandler = this.onClickHandler.bind(this);
    this.onRewardChanged = this.onRewardChanged.bind(this);
    this.addPayRequest = this.addPayRequest.bind(this);
    this.removePayRequest = this.removePayRequest.bind(this);
    this.validateFields = this.validateFields.bind(this);
  }

  componentDidMount() {
    const {
      props: { url }
    } = this;
    this.http = new HttpOfferPay(url);
  }

  render() {
    const {
      state: { reward, reward_error }
    } = this;
    const {
      props: { offer, wallet, address, requestsInProgress, onBackPressed }
    } = this;

    const title = strings.title + offer.expert;

    return (
      <div className="OfferPay">
        <Header
          title={title}
          requests={requestsInProgress}
          back={true}
          onBack={onBackPressed}
          address={address}
          wallet={wallet}
        />
        <div className="OfferPay-Content">
          <div className="OfferPay-Center">
            <h2>{strings.instructions}</h2>
            <AnimatedInput
              type="number"
              onChange={this.onRewardChanged}
              error={reward_error}
              placeholder={strings.reward}
              input_id="reward"
            />
            <div className="OfferPay-Upload">
              <Button
                disabled={!reward || reward_error}
                onClick={this.onClickHandler}
              >
                {strings.pay}
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  onClickHandler() {
    this.payExpert();
  }

  onRewardChanged(reward) {
    this.setState({ reward: reward }, () => {
      this.validateFields();
    });
  }

  payExpert() {
    const {
      state: { reward, reward_error }
    } = this;
    const {
      props: { offer, onBackPressed, encryptionKey, onAddMessage }
    } = this;

    const rewardWei = web3Utils.toWei(reward);
    const sequence = offer.nextSequence;
    const http = this.http;
    if (reward && !reward_error) {
      const uuid = Uuid();
      this.addPayRequest(uuid);
      return new Promise(resolve => {
        if (onBackPressed) {
          onBackPressed();
        }
        resolve();
      })
        .then(() => http.pay(encryptionKey, offer, sequence, rewardWei))
        .then(() => {
          const message = {
            type: 'payment',
            amount: rewardWei,
            sequence: sequence
          };
          onAddMessage(offer.guid, message);
          return;
        })
        .catch(error => {
          let errorMessage;
          if (!error || !error.message || error.message.length === 0) {
            errorMessage = strings.error;
          } else {
            errorMessage = error.message;
          }
          this.setState({ error: errorMessage });

          //Update app
          const {
            props: { onError }
          } = this;
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
    const {
      state: { reward }
    } = this;
    const {
      props: { last }
    } = this;
    const min = new BigNumber('0');
    const lastPay = new BigNumber(last);
    if (reward && new BigNumber(web3Utils.toWei(reward)).comparedTo(min) <= 0) {
      this.setState({ reward_error: 'Reward must be more than 0 NCT.' });
    } else if (
      reward &&
      new BigNumber(web3Utils.toWei(reward)).comparedTo(lastPay) <= 0
    ) {
      this.setState({
        reward_error: `Reward must be higher than last payment of ${web3Utils.fromWei(
          last
        )}.`
      });
    } else {
      this.setState({ reward_error: null });
    }
  }
}

OfferPay.propTypes = {
  onAddMessage: PropTypes.func,
  wallet: PropTypes.object,
  address: PropTypes.string,
  onError: PropTypes.func,
  onRequestWalletChange: PropTypes.func,
  addOffer: PropTypes.func,
  addRequest: PropTypes.func,
  removeRequest: PropTypes.func,
  url: PropTypes.string,
  last: PropTypes.string,
  encryptionKey: PropTypes.object
};
export default OfferPay;

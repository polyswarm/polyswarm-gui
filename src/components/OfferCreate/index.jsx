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
import ModalPassword from '../ModalPassword';
// Component imports
import strings from './strings';
import HttpOfferCreate from './http';

class OfferCreate extends Component {
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

    this.onClickHandler = this.onClickHandler.bind(this);
    this.onDurationChanged = this.onDurationChanged.bind(this);
    this.onExpertChanged = this.onExpertChanged.bind(this);
    this.onRewardChanged = this.onRewardChanged.bind(this);
    this.addCreateOfferRequest = this.addCreateOfferRequest.bind(this);
    this.removeCreateOfferRequest = this.removeCreateOfferRequest.bind(this);
    this.validateFields = this.validateFields.bind(this);
    this.onWalletChangeHandler = this.onWalletChangeHandler.bind(this);
  }

  componentDidMount() {
    const { props: { url } } = this;
    this.http = new HttpOfferCreate(url);
  }

  render() {
    const { state: { reward, reward_error, duration, duration_error, expert, expert_error } } = this;
    const { props: { url, walletList, addRequest, removeRequest, address,
      requestsInProgress, onBackPressed } } = this;

    const wallet = walletList[address] || {address: null, eth: null, nct: null};

    return (
      <div className='OfferCreate'>
        <Header title={strings.createOffer}
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
        <div className='OfferCreate-Content'>
          <div className='Offer-Values'>
            <h2>{strings.title}</h2>
            <AnimatedInput type='text'
              onChange={this.onExpertChanged}
              error={expert_error}
              placeholder={strings.expert}
              input_id='expert'/>
            <AnimatedInput type='number'
              onChange={this.onRewardChanged}
              error={reward_error}
              placeholder={strings.reward}
              input_id='reward'/>
            <AnimatedInput type='number'
              onChange={this.onDurationChanged}
              error={duration_error}
              placeholder={strings.duration}
              input_id='duration'/>
          </div>
          <div className='Offer-Create-Upload'>
            <Button
              disabled={!reward || !duration || reward_error || duration_error || !expert || expert_error}
              onClick={this.onClickHandler}>
              {strings.openOffer}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  onOfferPosted() {
    const {props: {onOfferPosted}} = this;
    if (onOfferPosted) {
      onOfferPosted();
    }
  }
  
  onClickHandler() {
    this.modal.open();
  }
  
  onDurationChanged(duration) {
    this.setState({duration: duration}, () => {
      this.validateFields();
    });
  }

  onExpertChanged(expert) {
    this.setState({expert: expert}, () => {
      this.validateFields();
    });
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
      this.createOffer();
    }
  }

  createOffer() {
    const { state: {expert, expert_error, reward, reward_error, duration,
      duration_error}, props: { addOffer } } = this;

    const rewardWei = new BigNumber(reward).times(new BigNumber('1000000000000000000'));

    const http = this.http;
    if (expert && reward && duration && !duration_error && !reward_error && !expert_error) {
      const uuid = Uuid();
      this.addCreateOfferRequest(uuid);
      return new Promise(resolve => {
        this.onOfferPosted();
        resolve();
      })
        .then(() => http.createOffer(expert, rewardWei.toString(), Number(duration)))
        .then(result => {
          if (addOffer) {
            addOffer(result);
          }
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
          const { props: { onWalletChange, onError } } = this;
          if (onWalletChange) {
            onWalletChange(false);
          }
          if (onError) {
            onError(errorMessage);
          }
        })
        .then(() => {
          this.removeCreateOfferRequest(uuid);
        });
    } else {
      return null;
    }
  }

  addCreateOfferRequest(id) {
    const { addRequest } = this.props;
    if (addRequest) {
      addRequest(strings.requestCreateOffer, id);
    }
  }

  removeCreateOfferRequest(id) {
    const { removeRequest } = this.props;
    if (removeRequest) {
      removeRequest(strings.requestCreateOffer, id);
    }
  }

  validateFields() {
    const {state: {duration, reward, expert}} = this;

    if (duration && duration < 1) {
      this.setState({duration_error: 'Duration below 1.'});
    } else if (duration && !Number.isInteger(Number(duration))) {
      this.setState({duration_error: 'Duration must be integer.'});
    } else {
      this.setState({duration_error: null});
    }

    const min = new BigNumber('0.0625');
    if (reward && new BigNumber(reward).comparedTo(min) < 0 ) {
      this.setState({reward_error: 'Reward below 0.0625 minimum.'});
    } else {
      this.setState({reward_error: null});
    }

    //TODO validate expert
    if (expert && !web3Utils.isAddress(expert)) {
      this.setState({expert_error: 'Expert address must be a valid Ethereum address.'});
    } else {
      this.setState({expert_error: null});
    }
  }
}

OfferCreate.propTypes = {
  walletList: PropTypes.array,
  address: PropTypes.number,
  onError: PropTypes.func,
  onWalletChange: PropTypes.func,
  addOffer: PropTypes.func,
  addRequest: PropTypes.func,
  removeRequest: PropTypes.func,
  url: PropTypes.string
};
export default OfferCreate;

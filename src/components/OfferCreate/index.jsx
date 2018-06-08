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
      nectar_error: null,
      nectar: null,
      websocket: null,
      websocket_error: null,
      creating: false
    };

    this.onClickHandler = this.onClickHandler.bind(this);
    this.onDurationChanged = this.onDurationChanged.bind(this);
    this.onExpertChanged = this.onExpertChanged.bind(this);
    this.onRewardChanged = this.onRewardChanged.bind(this);
    this.onWebsocketChanged = this.onWebsocketChanged.bind(this);
    this.addCreateOfferRequest = this.addCreateOfferRequest.bind(this);
    this.removeCreateOfferRequest = this.removeCreateOfferRequest.bind(this);
    this.validateFields = this.validateFields.bind(this);
  }

  componentDidMount() {
    const { props: { url } } = this;
    this.http = new HttpOfferCreate(url);
  }

  render() {
    const { state: { reward, reward_error, duration, duration_error, expert, expert_error, websocket, websocket_error, creating } } = this;
    const { props: {  wallet, address, requestsInProgress, onBackPressed } } = this;

    return (
      <div className='OfferCreate'>
        <Header title={strings.createOffer}
          requests={requestsInProgress}
          back={true}
          onBack={onBackPressed}
          address={address}
          wallet={wallet}/>
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
            <AnimatedInput type='text'
              onChange={this.onWebsocketChanged}
              error={websocket_error}
              placeholder={strings.websocket}
              input_id='websocket'/>
          </div>
          <div className='Offer-Create-Upload'>
            <Button
              disabled={!creating && (!reward || !duration || reward_error || duration_error || !expert || expert_error || !websocket || websocket_error) }
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
    this.createOffer();
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
  
  onWebsocketChanged(websocket) {
    this.setState({websocket: websocket}, () => {
      this.validateFields();
    });
  }

  createOffer() {
    const { state: {expert, expert_error, reward, reward_error, duration,
      duration_error, websocket, websocket_error} } = this;
    const { props: { addOffer, address, onOfferCreated, encryptionKey, token } } = this;

    const rewardWei = web3Utils.toWei(reward);

    const http = this.http;
    if (expert && reward && duration && websocket && !duration_error && !reward_error && !expert_error && !websocket_error) {
      this.setState({creating: true});
      const uuid = Uuid();
      this.addCreateOfferRequest(uuid);
      return new Promise(resolve => {
        if (onOfferCreated) {
          onOfferCreated();
        }
        resolve();
      })
        .then(() => http.createOffer(address, expert, Number(duration), websocket))
        .then(result => {
          if (addOffer) {
            addOffer(result, websocket, reward);
          }
          return result;
        })
        .then((result) => http.openOffer(encryptionKey, token, result, rewardWei))
        .catch(error => {
          this.setState({creating: false});
          let errorMessage;
          if (!error || !error.message || error.message.length === 0) {
            errorMessage = strings.error;
          } else {
            errorMessage = error.message;
          }
          this.setState({ error: errorMessage });

          //Update app
          const { props: { onError } } = this;
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
    const {state: {duration, reward,  expert, websocket}} = this;
    if (duration && duration < 10) {
      this.setState({duration_error: 'Duration below 10.'});
    } else if (duration && !Number.isInteger(Number(duration))) {
      this.setState({duration_error: 'Duration must be integer.'});
    } else {
      this.setState({duration_error: null});
    }

    const min = new BigNumber('0');
    if (reward && new BigNumber(reward).comparedTo(min) <= 0 ) {
      this.setState({reward_error: 'Reward below 0.'});
    } else {
      this.setState({reward_error: null});
    }

    if (websocket && !websocket.startsWith('ws://')) {
      this.setState({websocket_error: 'Value must be a websocket uri'});
    } else {
      this.setState({websocket_error: null});
    }

    if (expert && !web3Utils.isAddress(expert)) {
      this.setState({expert_error: 'Expert address must be a valid Ethereum address.'});
    } else {
      this.setState({expert_error: null});
    }
  }
}

OfferCreate.propTypes = {
  wallet: PropTypes.object,
  address: PropTypes.string,
  onError: PropTypes.func,
  onOfferCreated: PropTypes.func,
  addOffer: PropTypes.func,
  addRequest: PropTypes.func,
  removeRequest: PropTypes.func,
  url: PropTypes.string,
  onRequestWalletChange: PropTypes.func,
  encryptionKey: PropTypes.object,
};
export default OfferCreate;

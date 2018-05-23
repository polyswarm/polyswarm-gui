// Vendor imports
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Uuid from 'uuid/v4';
import BigNumber from 'bignumber.js';
// Offer imports
import AnimatedInput from '../AnimatedInput';
import Button from '../Button';
import ModalPassword from '../ModalPassword';
// Component imports
import strings from './strings';

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
  }

  componentDidMount() {
    const { props: { url } } = this;
    // this.http = new Http(url);
  }

  render() {
    const { state: { reward, reward_error, duration, duration_error, expert, expert_error } } = this;
    const { props: { url, walletList, addRequest, removeRequest } } = this;
    return (
      <div className='OfferCreate'>
        <ModalPassword
          ref={modal => (this.modal = modal)}
          url={url}
          walletList={walletList}
          onWalletChange={this.onWalletChangeHandler}
          addRequest={addRequest}
          removeRequest={removeRequest}/>
        <div className='OfferCreate-Content'>
          <form className='Offer-Values'>
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
          </form>
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
  
  onWalletChangeHandler(didUnlock, store) {
    const { props: { onWalletChange } } = this;
    if (onWalletChange) {
      onWalletChange(store);
    }
    if (didUnlock) {
      this.createOffer();
    }
  }

  createOffer() {
    // const { state: {reward, duration} ,props: { addOffer } } = this;
    // const files = this.state.files.slice();

    // const rewardWei = new BigNumber(reward).times(new BigNumber('1000000000000000000'));

    // const http = this.http;
    // if (files && files.length > 0) {
    //   this.onOfferPosted();
    //   const uuid = Uuid();
    //   this.addCreateOfferRequest(uuid);
    //   this.setState({ files: [], error: null });
    //   return http.uploadFiles(files)
    //     .then(artifact =>
    //       http.uploadOffer(rewardWei.toString(), artifact, Number(duration))
    //     )
    //     .then(result => {
    //       if (addOffer) {
    //         addOffer(result);
    //       }
    //     })
    //     .catch(error => {
    //       let errorMessage;
    //       if (!error || !error.message || error.message.length === 0) {
    //         errorMessage = strings.error;
    //       } else {
    //         errorMessage = error.message;
    //       }
    //       this.setState({ error: errorMessage });

    //       //Update app
    //       const { props: { onWalletChange, onError } } = this;
    //       if (onWalletChange) {
    //         onWalletChange(false);
    //       }
    //       if (onError) {
    //         onError(errorMessage);
    //       }
    //     })
    //     .then(() => {
    //       this.removeCreateOfferRequest(uuid);
    //     });
    // } else {
    //   return null;
    // }
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
    const {state: {duration, reward}} = this;

    if (duration && duration < 1) {
      this.setState({duration_error: 'Duration below 1.'});
    } else if (duration && !Number.isInteger(Number(duration))) {
      this.setState({duration_error: 'Duration must be integer.'});
    } else {
      this.setState({duration_error: null});
    }

    const min = new BigNumber('0.0625');
    if (reward && new BigNumber(reward).comparedTo(min) < 0 ) {
      this.setState({reward_error: 'Reward below 0.0625 minumum.'});
    } else {
      this.setState({reward_error: null});
    }

    //TODO validate expert
  }
}

OfferCreate.propTypes = {
  walletList: PropTypes.array,
  onError: PropTypes.func,
  onWalletChange: PropTypes.func,
  addOffer: PropTypes.func,
  addRequest: PropTypes.func,
  removeRequest: PropTypes.func,
  url: PropTypes.string
};
export default OfferCreate;

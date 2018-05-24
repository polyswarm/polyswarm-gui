// Vendor imports
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Uuid from 'uuid/v4';
import BigNumber from 'bignumber.js';
// Bounty imports
import Button from '../Button';
import AnimatedInput from '../AnimatedInput';
import DropTarget from '../DropTarget';
import FileList from '../FileList';
import Header from '../Header';
import ModalPassword from '../ModalPassword';
// Component imports
import strings from './strings';
import Http from './http';

class BountyCreate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      files: [],
      reward_error: null,
      reward: null,
      duration: null,
      duration_error: null,
      next: false,
    };

    this.onBackClick = this.onBackClick.bind(this);
    this.onBountyPosted = this.onBountyPosted.bind(this);
    this.onClearAll = this.onClearAll.bind(this);
    this.onClickHandler = this.onClickHandler.bind(this);
    this.onDurationChanged = this.onDurationChanged.bind(this);
    this.onFileRemoved = this.onFileRemoved.bind(this);
    this.onMultipleFilesSelected = this.onMultipleFilesSelected.bind(this);
    this.onNextClick = this.onNextClick.bind(this);
    this.onRewardChanged = this.onRewardChanged.bind(this);
    this.createBounty = this.createBounty.bind(this);
    this.cancel = this.cancel.bind(this);
    this.onWalletChangeHandler = this.onWalletChangeHandler.bind(this);
    this.addCreateBountyRequest = this.addCreateBountyRequest.bind(this);
    this.removeCreateBountyRequest = this.removeCreateBountyRequest.bind(this);
    this.validateFields = this.validateFields.bind(this);
  }

  componentDidMount() {
    const { props: { url } } = this;
    this.http = new Http(url);
  }

  render() {
    const { state: { files, reward, reward_error, duration, duration_error, next } } = this;
    const { props: { url, walletList, addRequest, removeRequest, address, 
      onBackPressed, requestsInProgress } } = this;

    const wallet = walletList[address] || {address: null, eth: null, nct: null};

    return (
      <div className='BountyCreate'>
        <Header title={strings.title}
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
        <div className='BountyCreate-Content'>
          <div className='BountyCreate-Centered'>
            <div className='BountyCreate-Header'>
              <h2>{!next ? strings.first : strings.last}</h2>
              <div className='BountyCreate-Header-Buttons'>
                <Button flat
                  cancel
                  disabled={!next}
                  onClick={this.onBackClick}>
                  {strings.back}
                </Button>
                <Button flat
                  disabled={next || !files || files.length == 0}
                  onClick={this.onNextClick}>
                  {strings.next}
                </Button>
              </div>
            </div>
            {next && (
              <React.Fragment>
                <form className='Bounty-Values'>
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
                <div className='Bounty-Create-Upload'>
                  <Button
                    disabled={!reward || !duration || reward_error || duration_error || !files || files.length == 0}
                    onClick={this.onClickHandler}>
                    {`Create ${files.length} file bounty`}
                  </Button>
                </div>
              </React.Fragment>
            )}
            {!next && (
              <div className='Bounty-Files'>
                <div className='Bounty-Button'>
                </div>
                <DropTarget onFilesSelected={this.onMultipleFilesSelected} />
                <FileList
                  files={files}
                  clear={this.onClearAll}
                  removeFile={this.onFileRemoved}/>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  onBackClick() {
    this.setState({next: false});
  }

  onBountyPosted() {
    const {props: {onBountyPosted}} = this;
    if (onBountyPosted) {
      onBountyPosted();
    }
  }
  
  onClearAll() {
    this.setState({ files: [], error: null });
  }
  
  onClickHandler() {
    this.modal.open();
  }
  
  onDurationChanged(duration) {
    this.setState({duration: duration}, () => {
      this.validateFields();
    });
  }
  
  onFileRemoved(index) {
    const files = this.state.files.slice();
    if (index >= 0 && index < files.length) {
      files.splice(index, 1);
      this.setState({ files: files, error: null });
    }
  }
  
  onMultipleFilesSelected(files) {
    const f = this.state.files.slice();
    const combined = f.concat(files);
    this.setState({ files: combined });
  }
  
  onNextClick() {
    this.setState({next: true});
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
      this.createBounty();
    }
  }

  cancel() {
    const { http } = this;
    http.cancel();
  }

  createBounty() {
    const { state: {reward, duration} ,props: { addBounty } } = this;
    const files = this.state.files.slice();

    const rewardWei = new BigNumber(reward).times(new BigNumber('1000000000000000000'));

    const http = this.http;
    if (files && files.length > 0) {
      const uuid = Uuid();
      this.addCreateBountyRequest(uuid);
      this.setState({ files: [], error: null });
      return new Promise((resolve) => {
        this.onBountyPosted();
        resolve();
      })
        .then(() => http.uploadFiles(files))
        .then(artifact =>
          http.uploadBounty(rewardWei.toString(), artifact, Number(duration))
        )
        .then(result => {
          if (addBounty) {
            addBounty(result);
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
          this.removeCreateBountyRequest(uuid);
        });
    } else {
      return null;
    }
  }

  addCreateBountyRequest(id) {
    const { addRequest } = this.props;
    if (addRequest) {
      addRequest(strings.requestCreateBounty, id);
    }
  }

  removeCreateBountyRequest(id) {
    const { removeRequest } = this.props;
    if (removeRequest) {
      removeRequest(strings.requestCreateBounty, id);
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
  }
}

BountyCreate.propTypes = {
  walletList: PropTypes.array,
  address: PropTypes.number,
  onWalletChange: PropTypes.func,
  onError: PropTypes.func,
  addBounty: PropTypes.func,
  addRequest: PropTypes.func,
  removeRequest: PropTypes.func,
  url: PropTypes.string
};
// url, walletList, addRequest, removeRequest, address, 
//       onBackClick, requestsInProgress 
export default BountyCreate;

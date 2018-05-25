// Vendor imports
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Uuid from 'uuid/v4';
// Bounty imports
import DropTarget from '../DropTarget';
import FileList from '../FileList';
import Button from '../Button';
import ModalPassword from '../ModalPassword';
import Header from '../Header';
// Component imports
import strings from './strings';
import HttpRequest from './http';

class OfferRequest extends Component {
  constructor(props) {
    super(props);
    this.state = {
      files: [],
    };
    this.onClearAll = this.onClearAll.bind(this);
    this.onClickHandler = this.onClickHandler.bind(this);
    this.onError = this.onError.bind(this);
    this.onFileRemoved = this.onFileRemoved.bind(this);
    this.onFilesSent = this.onFilesSent.bind(this);
    this.onMultipleFilesSelected = this.onMultipleFilesSelected.bind(this);
    this.onWalletChangeHandler = this.onWalletChangeHandler.bind(this);
    this.addMessage = this.addMessage.bind(this);
    this.addSendMessageRequest = this.addSendMessageRequest.bind(this);
    this.removeSendMessageRequest = this.removeSendMessageRequest.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
  }

  componentDidMount() {
    const { props: { url } } = this;
    this.http = new HttpRequest(url);
  }

  render() {
    const { state: { files } } = this;
    const { props: { url, offer, addRequest, removeRequest, requestsInProgress, 
      walletList, onBackPressed } } = this;
    
    const index = walletList.findIndex((wallet) => wallet.address === offer.author);
    const wallet = walletList[index];

    return (
      <div className='OfferRequest'>
        <Header title={offer.guid}
          requests={requestsInProgress}
          back={true}
          onBack={onBackPressed}
          address={wallet.address}
          nct={wallet.nct}
          eth={wallet.eth}/>
        <div className='OfferRequest-Content'>
          <ModalPassword
            ref={modal => (this.modal = modal)}
            url={url}
            address={index}
            walletList={walletList}
            onWalletChange={this.onWalletChangeHandler}
            addRequest={addRequest}
            removeRequest={removeRequest}/>
          <div className='OfferRequest-Files'>
            <h2>{strings.instructions}</h2>
            <div className='OfferRequest-Button'>
              <Button
                disabled={ !files || files.length == 0 }
                onClick={this.onClickHandler}>
                {`Send ${files.length} files.`}
              </Button>
            </div>
            <DropTarget onFilesSelected={this.onMultipleFilesSelected} />
            <FileList
              files={files}
              clear={this.onClearAll}
              removeFile={this.onFileRemoved}/>
          </div>
        </div>
      </div>
    );
  }

  onClearAll() {
    this.setState({ files: []});
  }
  
  onClickHandler() {
    this.modal.open();
  }
  
  onError(message) {
    const { props: { onError } } = this;
    if (onError) {
      onError(message);
    }
  }
  
  onFileRemoved(index) {
    const files = this.state.files.slice();
    if (index >= 0 && index < files.length) {
      files.splice(index, 1);
      this.setState({ files: files });
    }
  }
  
  onFilesSent() {
    const {props: {onFilesSent}} = this;
    if (onFilesSent) {
      onFilesSent();
    }
  }

  onMultipleFilesSelected(files) {
    const f = this.state.files.slice();
    const combined = f.concat(files);
    this.setState({ files: combined });
  }
  
  onWalletChangeHandler(didUnlock) {
    const { props: { onWalletChange } } = this;
    if (onWalletChange) {
      onWalletChange();
    }
    if (didUnlock) {
      this.sendMessage();
    }
  }

  addMessage(message) {
    const {props: {addMessage}} = this;
    if (addMessage) {
      addMessage(message);
    }
  }

  addSendMessageRequest(id) {
    const { addRequest } = this.props;
    if (addRequest) {
      addRequest(strings.request, id);
    }
  }

  removeSendMessageRequest(id) {
    const { removeRequest } = this.props;
    if (removeRequest) {
      removeRequest(strings.request, id);
    }
  }

  sendMessage() {
    const files = this.state.files.slice();

    const http = this.http;
    if (files && files.length > 0) {
      const uuid = Uuid();
      this.addSendMessageRequest(uuid);
      this.setState({ files: [] });
      return new Promise((resolve) => {
        this.onFilesSent();
        resolve();
      })
        .then(() => http.uploadFiles(files))
        .then(artifact => http.sendRequest(artifact))
        .then(result => this.addMessage(result))
        .catch(error => {
          let errorMessage;
          if (!error || !error.message || error.message.length === 0) {
            errorMessage = strings.error;
          } else {
            errorMessage = error.message;
          }

          //Update app
          this.onError(errorMessage);
        })
        .then(() => {
          this.removeSendMessageRequest(uuid);
        });
    } else {
      return null;
    }
  }
}

OfferRequest.propTypes = {
  addMessage: PropTypes.func,
  addRequest: PropTypes.func,
  onError: PropTypes.func,
  onWalletChange: PropTypes.func,
  removeRequest: PropTypes.func,
  url: PropTypes.string,
  offer: PropTypes.object,
  requestsInProgress: PropTypes.array,
  walletList: PropTypes.array,
  onBackPressed: PropTypes.func,
};
export default OfferRequest;

// Vendor imports
import React, { Component } from 'react';
import PropTypes from 'prop-types';
// Bounty imports
import Header from '../Header';
import OfferPay from '../OfferPay';
import OfferMessageList from '../OfferMessageList';
import OfferRequest from '../OfferRequest';
import OfferSummary from '../OfferSummary';

class OfferInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      request: false,
      pay: false,
    };

    this.onBack = this.onBack.bind(this);
    this.onPayClick = this.onPayClick.bind(this);
    this.onRequestClick = this.onRequestClick.bind(this);
  }

  render() {
    const { props: { offer, address, addRequest, removeRequest, url, wallet,
      onBackPressed, requestsInProgress, onError },
    state: { request, pay } } = this;

    // only show actions if signing wallet is same as wallet used to create this
    let headerActions = [];
    if (address.toUpperCase() === offer.author.toUpperCase()) {
      headerActions = [
        {title: 'Pay', onClick: this.onPayClick},
        {title: 'Request', onClick: this.onRequestClick},
      ];
    }

    let last = '0';
    if (offer.messages) {
      const payments = offer.messages.filter(message => message.type === 'payment').sort((a, b) => a.amount < b.amount);
      last = payments.length > 0 ? payments[0].amount : '0';
    }

    return (
      <div className='OfferInfo'>
        {request && (
          <OfferRequest offer={offer}
            address={address}
            wallet={wallet}
            addRequest={addRequest}
            removeRequest={removeRequest}
            requestsInProgress={requestsInProgress}
            onBackPressed={this.onBack}
            onError={onError}
            onFilesSent={this.onBack}
            addMessage={this.onAddMessage}
            url={url}/>
        )}
        {pay && (
          <OfferPay
            offer={offer}
            last={last}
            address={address}
            wallet={wallet}
            addRequest={addRequest}
            removeRequest={removeRequest}
            requestsInProgress={requestsInProgress}
            onError={onError}
            onBackPressed={this.onBack}
            url={url}/>
        )}
        {!request && !pay && (
          <div className='Offer-Info'>
            <Header title={offer.guid}
              requests={requestsInProgress}
              back={true}
              onBack={onBackPressed}
              address={address}
              wallet={wallet}
              actions={headerActions}/>
            
            <div className='Offer-Info-Container'>
              <OfferSummary offer={offer}/>
              <OfferMessageList className='Offer-Info-Messages'
                offer={offer} />
            </div>
          </div>
        )}
      </div>
    );
  }

  addMessage() {
    const {props: {onAddMessage, offer}} = this;
    if (onAddMessage) {
      // Tells app that this offer has a new message to retrieve.
      onAddMessage(offer);
    }
  }

  onBack() {
    this.setState({request: false, pay: false});
  }

  onPayClick() {
    this.setState({pay: true});
  }

  onRequestClick() {
    this.setState({request: true});
  }
}

OfferInfo.propTypes = {
  offer: PropTypes.object.isRequired,
  wallet: PropTypes.object,
  address: PropTypes.string,
  onRequestWalletChange: PropTypes.func,
  addRequest: PropTypes.func,
  removeRequest: PropTypes.func,
  url: PropTypes.string,
  onBackPressed: PropTypes.func,
  requestsInProgress: PropTypes.array,
};
export default OfferInfo;

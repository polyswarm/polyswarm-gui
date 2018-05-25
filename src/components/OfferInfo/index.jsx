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
    const { props: { offer, addRequest, removeRequest, url, walletList,
      onBackPressed, requestsInProgress, onError, onWalletChange },
    state: { request, pay } } = this;

    const index = walletList.findIndex((wallet) => wallet.address === offer.author);

    const wallet = walletList[index];
    const shortened = [wallet];
    
    const headerActions = [
      {title: 'Pay', onClick: this.onPayClick},
      {title: 'Request', onClick: this.onRequestClick},
    ];

    const payments = offer.messages.filter(message => message.type === 'payment').sort((a, b) => a.amount < b.amount);
    const last = payments.length > 0 ? payments[0].amount : '0';

    return (
      <React.Fragment>
        {request && (
          <OfferRequest offer={offer}
            address={0}
            walletList={shortened}
            addRequest={addRequest}
            removeRequest={removeRequest}
            requestsInProgress={requestsInProgress}
            onBackPressed={this.onBack}
            onError={onError}
            onFilesSent={this.onBack}
            onWalletChange={onWalletChange}
            addMessage={this.onAddMessage}
            url={url}/>
        )}
        {pay && (
          <OfferPay
            offer={offer}
            last={last}
            walletList={shortened}
            addRequest={addRequest}
            removeRequest={removeRequest}
            requestsInProgress={requestsInProgress}
            onError={onError}
            onBackPressed={this.onBack}
            onWalletChange={onWalletChange}
            url={url}/>
        )}
        {!request && !pay && (
          <div className='Offer-Info'>
            <Header title={offer.guid}
              requests={requestsInProgress}
              back={true}
              onBack={onBackPressed}
              address={wallet.address}
              nct={wallet.nct}
              eth={wallet.eth}
              actions={headerActions}/>
            
            <div className='Offer-Info-Container'>
              <OfferSummary offer={offer}/>
              <OfferMessageList className='Offer-Info-Messages'
                offer={offer} />
            </div>
          </div>
        )}
      </React.Fragment>
    );
  }

  addMessage(message) {

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
  onWalletChange: PropTypes.func,
  walletList: PropTypes.array,
  addRequest: PropTypes.func,
  removeRequest: PropTypes.func,
  url: PropTypes.string,
  onBackPressed: PropTypes.func,
  requestsInProgress: PropTypes.array,
};
export default OfferInfo;

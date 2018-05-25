// Vendor imports
import React, { Component } from 'react';
import PropTypes from 'prop-types';
// Bounty imports
import Header from '../Header';
import ModalPay from '../ModalPay';
import OfferMessageList from '../OfferMessageList';
import OfferRequest from '../OfferRequest';
import OfferSummary from '../OfferSummary';

class OfferInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      request: false,
    };

    this.onBack = this.onBack.bind(this);
    this.onPayClick = this.onPayClick.bind(this);
    this.onRequestClick = this.onRequestClick.bind(this);
  }

  render() {
    const { props: { offer, addRequest, removeRequest, url, walletList,
      onBackPressed, requestsInProgress, onError }, state: { request } } = this;

    const index = walletList.findIndex((wallet) => wallet.address === offer.author);

    const wallet = walletList[index];
    const headerActions = [
      {title: 'Pay', onClick: this.onPayClick},
      {title: 'Request', onClick: this.onRequestClick},
    ];

    return (
      <React.Fragment>
        {request && (
          <OfferRequest offer={offer}
            address={index}
            walletList={walletList}
            addRequest={addRequest}
            removeRequest={removeRequest}
            requestsInProgress={requestsInProgress}
            onBackPressed={this.onBack}
            onError={onError}
            addMessage={this.onAddMessage}/>
        )}
        {!request && (
          <div className='Offer-Info'>
            <Header title={offer.guid}
              requests={requestsInProgress}
              back={true}
              onBack={onBackPressed}
              address={wallet.address}
              nct={wallet.nct}
              eth={wallet.eth}
              actions={headerActions}/>
            <ModalPay ref={(pay)=> this.pay = pay}
              author={offer.author}
              expert={offer.expert}
              nct={wallet.nct}
              eth={wallet.eth}
              addRequest={addRequest}
              removeRequest={removeRequest}
              url={url}
            />
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
    this.setState({request: false});
  }

  onPayClick() {
    this.pay.open();
  }

  onRequestClick() {
    this.setState({request: true});
  }
}

OfferInfo.propTypes = {
  offer: PropTypes.object.isRequired,
  walletList: PropTypes.array,
  addRequest: PropTypes.func,
  removeRequest: PropTypes.func,
  url: PropTypes.string,
  onBackPressed: PropTypes.func,
  requestsInProgress: PropTypes.array,
};
export default OfferInfo;

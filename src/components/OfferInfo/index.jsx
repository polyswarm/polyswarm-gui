// Vendor imports
import React, { Component } from 'react';
import PropTypes from 'prop-types';
// Bounty imports
import Header from '../Header';
import ModalPay from '../ModalPay';
import OfferMessageList from '../OfferMessageList';
import OfferSummary from '../OfferSummary';

class OfferInfo extends Component {
  constructor(props) {
    super(props);

    this.onPayClick = this.onPayClick.bind(this);
    this.onRequestClick = this.onRequestClick.bind(this);
  }

  render() {
    const { props: { offer, addRequest, removeRequest, url, walletList, 
      onBackPressed, requestsInProgress } } = this;

    const index = walletList.findIndex((wallet) => wallet.address === offer.author);

    const wallet = walletList[index];

    return (
      <div className='Offer-Info'>
        <Header title={offer.guid}
          requests={requestsInProgress}
          back={true}
          onBack={onBackPressed}
          address={wallet.address}
          nct={wallet.nct}
          eth={wallet.eth}/>
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
          <OfferSummary offer={offer}
            onPayClick={this.onPayClick}
            onRequestClick={this.onRequestClick}/>
          <OfferMessageList className='Offer-Info-Messages'
            offer={offer} />
        </div>
      </div>
    );
  }

  onPayClick() {
    this.pay.open();
  }

  onRequestClick() {

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

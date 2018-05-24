// Vendor imports
import React, { Component } from 'react';
import PropTypes from 'prop-types';
// Bounty imports
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
    const { props: { offer, nct, eth, addRequest, removeRequest, url } } = this;

    return (
      <div className='Offer-Info'>
        <ModalPay ref={(pay)=> this.pay = pay}
          author={offer.author}
          expert={offer.expert}
          nct={nct}
          eth={eth}
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
  nct: PropTypes.number,
  eth: PropTypes.number,
};
export default OfferInfo;

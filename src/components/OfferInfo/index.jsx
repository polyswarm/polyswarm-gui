// Vendor imports
import React, { Component } from 'react';
import PropTypes from 'prop-types';
// Bounty imports
import OfferMessageList from '../OfferMessageList';
import OfferSummary from '../OfferSummary';

class OfferInfo extends Component {

  render() {
    const { props: { offer } } = this;

    return (
      <div className='Offer-Info'>
        <div className='Offer-Info-Container'>
          <OfferSummary offer={offer} />
          <OfferMessageList className='Offer-Info-Messages'
            offer={offer} />
        </div>
      </div>
    );
  }
}

OfferInfo.propTypes = {
  offer: PropTypes.object.isRequired,
};
export default OfferInfo;

// Vendor imports
import React, { Component } from 'react';
import PropTypes from 'prop-types';
// Bounty imports
import AssertionList from '../AssertionList';
import BountySummary from '../BountySummary';
import Header from '../Header';

class BountyInfo extends Component {

  render() {
    const { props: { bounty, requestsInProgress, onBackPressed, walletList, address } } = this;

    const wallet = walletList[address] || {address: null, eth: null, nct: null};

    return (
      <div className='Bounty-Info'>
        <Header title={bounty.guid}
          requests={requestsInProgress}
          back={true}
          onBack={onBackPressed}
          address={wallet.address}
          nct={wallet.nct}
          eth={wallet.eth}/>
        <div className='Bounty-Info-Container'>
          <BountySummary bounty={bounty} />
          <AssertionList className='Bounty-Info-Assertions'
            bounty={bounty} />
        </div>
      </div>
    );
  }
}

BountyInfo.propTypes = {
  bounty: PropTypes.object.isRequired,
  onBackPressed: PropTypes.func,
  walletList: PropTypes.array,
  requestsInProgress: PropTypes.array,
  address: PropTypes.number,
};
export default BountyInfo;

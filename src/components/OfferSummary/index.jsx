// Vendor imports
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import web3Utils from 'web3-utils';
import BigNumber from 'bignumber.js';
// Bounty imports
import StatRow from '../StatRow';
// Component imports
import strings from './strings';

class OfferSummary extends Component {
  render() {
    const {
      props: { offer }
    } = this;
    const messages = offer.messages || [];
    const hashDict = {};
    const artifacts = messages
      .filter(message => message.type === 'request')
      .map(message => message.artifacts)
      .reduce((all, artifacts) => all.concat(artifacts), [])
      .sort((a, b) => {
        return a.name > b.name;
      })
      .map(artifact => {
        const a = {};
        a.name = artifact.name;
        a.hash = artifact.hash;
        a.verdict = false;
        return artifact;
      })
      .filter(artifact => {
        // dedup based on file contents.
        if (typeof hashDict[artifact.hash] === 'undefined') {
          hashDict[artifact.hash] = artifact.name;
          return true;
        } else {
          return false;
        }
      });

    let last = '0';
    if (offer.messages) {
      const payments = offer.messages
        .filter(message => message.type === 'payment')
        .sort((a, b) => a.amount < b.amount);
      last = payments.length > 0 ? payments[0].amount : '0';
    }

    const initialWei = web3Utils.toWei(offer.initial);
    const balanceWei = new BigNumber(initialWei)
      .minus(new BigNumber(last))
      .toFixed();
    const balance = web3Utils.fromWei(balanceWei);

    messages
      .filter(message => message.type === 'assertion')
      .forEach(message => {
        message.artifacts.forEach((artifact, index) => {
          const verdict = message.verdicts[index];
          const i = artifacts.findIndex(value => value.hash === artifact.hash);
          if (i >= 0) {
            const current = artifacts[i].verdict || false;
            artifacts[i].verdict = current || verdict;
          }
        });
      });
    return (
      <div className="OfferSummary">
        <StatRow
          vertical
          title={strings.contractAddress}
          content={offer.msig_address}
        />
        <StatRow vertical title={strings.poster} content={offer.ambassador} />
        <StatRow vertical title={strings.expert} content={offer.expert} />
        <StatRow
          vertical
          title={strings.balance}
          content={`${balance || 0}${strings.nectar}`}
        />
        <StatRow
          vertical
          title={strings.closed}
          content={offer.closed ? strings.yes : strings.no}
        />
        <StatRow vertical title={strings.messages} content={messages.length} />
        {artifacts.map(artifact => {
          let content = artifact.verdict ? strings.malicious : strings.safe;
          return (
            <StatRow
              key={artifact.hash + artifact.name}
              vertical
              title={artifact.name}
              content={content}
            />
          );
        })}
      </div>
    );
  }
}
OfferSummary.proptypes = {
  offer: PropTypes.object.isRequired
};
export default OfferSummary;

// Vendor imports
import React, {Component} from 'react';
import PropTypes from 'prop-types';
// Bounty imports
import Button from '../Button';
import StatRow from '../StatRow';
// Component imports
import strings from './strings';

class OfferSummary extends Component {
  render() {
    const {props: {offer}} = this;
    const messages = offer.messages || [];
    const hashDict = {};
    const artifacts = messages
      .filter((message) => message.type==='request')
      .map((message) => message.artifacts)
      .reduce((all, artifacts) => all.concat(artifacts), [])
      .sort((a, b) => {
        return a.name > b.name;
      })
      .filter((artifact) => {
        if (typeof hashDict[artifact.hash] === 'undefined') {
          hashDict[artifact.hash] = artifact.name;
          return true;
        } else {
          return false;
        }
      });
    
    messages.filter((message) => message.type==='assertion')
      .forEach((message) => {
        message.artifacts.forEach((artifact, index) => {
          const verdict = message.verdicts[index];
          const i = artifacts.find((value) => value.hash === artifact.hash);
          if (i) {
            artifacts[index].verdict = verdict;
          }
        });
      });
    return (
      <div className='OfferSummary'>
        <StatRow vertical
          title={strings.poster}
          content={offer.author}/>
        <StatRow vertical
          title={strings.expert}
          content={offer.expert}/>
        <StatRow vertical
          title={strings.balance}
          content={`${offer.remaining || 0}${strings.nectar}`}/>
        <StatRow vertical
          title={strings.closed}
          content={offer.expired ? strings.yes : strings.no}/>
        <StatRow vertical
          title={strings.messages}
          content={messages.length}/>
        {artifacts.map((artifact) => {
          let content = artifact.verdict ? strings.malicious : strings.safe;
          return(
            <StatRow
              key={artifact.hash+artifact.name}
              vertical
              title={artifact.name}
              content={content}/>
          );
        })}
      </div>
    );
  }
}
OfferSummary.proptypes = {
  offer: PropTypes.object.isRequired,
};
export default OfferSummary;
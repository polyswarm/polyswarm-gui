// Vendor imports
import React, {Component} from 'react';
import PropTypes from 'prop-types';
// Bounty imports
import Button from '../Button';
import StatRow from '../StatRow';
// Component imports
import strings from './strings';

class OfferSummary extends Component {
  constructor(props) {
    super(props);

    this.onPayClick = this.onPayClick.bind(this);
    this.onRequestClick = this.onRequestClick.bind(this);
  }

  render() {
    const {props: {offer}} = this;
    const messages = offer.messages || [];
    const artifacts = messages
      .filter((message) => message.type==='request')
      .map((message) => message.files)
      .reduce((all, files) => all.concat(files), [])
      .sort((a, b) => {
        return a.name.compare(b.name);
      });
    
    messages.filter((message) => message.type==='assertion')
      .forEach((message) => {
        message.files.for_each((file, index) => {
          const verdict = message.verdicts[index];
          const i = artifacts.find((value) => value.hash === file.hash);
          if (i) {
            artifacts[index].verdict = verdict;
          }
        });
      });
    return (
      <div className='OfferSummary'>
        <div className='OfferActions'>
          <Button onClick={this.onPayClick}>
            {strings.pay}
          </Button>
          <Button onClick={this.onRequestClick}>
            {strings.request}
          </Button>
        </div>
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
              key={artifact.name}
              vertical
              title={artifact.name}
              content={content}/>
          );
        })}
      </div>
    );
  }

  onPayClick() {
    const {props: {onPayClick}} = this;
    if (onPayClick) {
      onPayClick();
    }
  }

  onRequestClick() {
    const {props: {onRequestClick}} = this;
    if (onRequestClick) {
      onRequestClick();
    }
  }
}
OfferSummary.proptypes = {
  offer: PropTypes.object.isRequired,
  onPayClick: PropTypes.func,
  onRequestClick: PropTypes.func,
};
export default OfferSummary;
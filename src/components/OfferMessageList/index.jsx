import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import web3Utils from 'web3-utils';
// Bounty imports
import Card from '../Card';
import CardContent from '../CardContent';
import CardHeader from '../CardHeader';
import StatRow from '../StatRow';
// Component imports
import strings from './strings';

class OfferMessageList extends Component {

  render() {
    const { props: { offer } } = this;
    const messages = offer.messages || [];
    messages.sort((a, b) => b.sequence - a.sequence);
    return (
      <div className='OfferMessageList'>
        <ul>
          {messages.map((message) => {
            let card = null;
            if (message.type === 'request') {
              card = this.renderRequest(message);
            } else if (message.type === 'assertion') {
              card = this.renderAssertion(message);
            } else {
              // payment
              card = this.renderPayment(message);
            }
            return (card);
          })}
        </ul>
        {( messages.length === 0) && (
          <div className='OfferMessageList-Placeholder'>
            <h3>
              {strings.empty}
            </h3>
          </div>
        )}
      </div>
    );
  }

  renderRequest(message) {
    const artifacts = message.artifacts;
    const artifactList = artifacts
      .map((artifact) => artifact.name)
      .reduce((accumulator, name) => `${accumulator}, ${name}`);
    return(
      <Card key={message.sequence}>
        <CardHeader
          title={strings.request}
        />
        <CardContent>
          <ul>
            <StatRow title={strings.files}
              content={artifactList}/>
          </ul>
        </CardContent>
      </Card>
    );
  }

  renderAssertion(message) {
    const artifacts = message.artifacts || [];
    const verdicts = message.verdicts || [];
    const worstVerdict = verdicts.reduce((accumulator, verdict) => accumulator || verdict);
    const verdictClass = classNames({
      'Assertion-Malignant': worstVerdict,
      'Assertion-Benign': !worstVerdict
    });
    return(
      <Card key={message.sequence}>
        <CardHeader
          additionalClasses={verdictClass}
          title={strings.assertion}
        />
        <CardContent>
          <ul>
            <StatRow title={strings.metadata}
              content={message.metadata}/>
            {artifacts && artifacts.map((artifact, index) => {
              return (
                <StatRow 
                  key={artifact.name}
                  title={artifact.name}
                  content={verdicts[index] ? strings.malicious : strings.safe}/>
              );
            })}
          </ul>
        </CardContent>
      </Card>
    );
  }

  renderPayment(message) {
    const amount = web3Utils.fromWei(message.amount);
    return(
      <Card key={message.sequence}>
        <CardHeader
          title={strings.payment}
          subhead={`${amount}${strings.nectar}`}
        />
      </Card>
    );
  }
}

OfferMessageList.proptypes = {
  offer: PropTypes.object.isRequired,
};
export default OfferMessageList;

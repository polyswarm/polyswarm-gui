import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
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
    const files = message.files;
    const filesList = files.map((file) => file.name).reduce((accumulator, name) => `, ${name}`);
    return(
      <Card key={message.guid}>
        <CardHeader
          title={strings.request}
        />
        <CardContent>
          <ul>
            <StatRow title={strings.files}
              content={filesList}/>
          </ul>
        </CardContent>
      </Card>
    );
  }

  renderAssertion(message) {
    const files = message.files || [];
    const verdicts = message.verdicts || [];
    const worstVerdict = verdicts.reduce((accumulator, verdict) => accumulator || verdict);
    const verdictClass = classNames({
      'Assertion-Malignant': worstVerdict,
      'Assertion-Benign': !worstVerdict
    });
    return(
      <Card key={message.guid}>
        <CardHeader
          className={verdictClass}
          title={strings.assertion}
        />
        <CardContent>
          <ul>
            <StatRow title={strings.metadata}
              content={message.metadata}/>
            {files && files.map((file, index) => {
              return (
                <StatRow 
                  key={file.name}
                  title={file.name}
                  content={verdicts[index] ? strings.malicious : strings.safe}/>
              );
            })}
          </ul>
        </CardContent>
      </Card>
    );
  }

  renderPayment(message) {
    return(
      <Card key={message.guid}>
        <CardHeader
          title={strings.payment}
          subhead={`${message.amount}${strings.nectar}`}
        />
      </Card>
    );
  }
}

OfferMessageList.proptypes = {
  offer: PropTypes.object.isRequired,
};
export default OfferMessageList;

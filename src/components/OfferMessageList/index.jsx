import React, { Component } from 'react';
import PropTypes from 'prop-types';
// Bounty imports
import Card from '../Card';
import CardContent from '../CardContent';
import CardHeader from '../CardHeader';
// Component imports
import strings from './strings';

class OfferMessageList extends Component {

  render() {
    const { props: { offer } } = this;
    const messages = offer.messages || [];
    return (
      <div className='OfferMessageList'>
        <ul>
          {
            messages.map((message) => {
              let card = null;
              if (message.type === 'request') {
                card = renderRequest(message);
              } else if (message.type === 'assertion') {
                card = renderAssertion(message);
              } else {
                // payment
                card = renderPayment(message);
              }
              return ({card});
            })
          }
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
    const filesList = files.reduce((accumulator, file) => `, ${file.name}`);
    return(
      <Card key={message.guid}>
        <CardHeader
          title={strings.request}
        />
        <CardContent>
          <StatRow title={strings.files}
            content={filesList}/>
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
          title={strings.request}
        />
        <CardContent>
          <StatRow title={strings.metadata}
            content={message.metadata}/>
          {files && files.map((file) => {
            return (
              <StatRow title={file.name}
                content={file.verdict ? strings.malicious : strings.safe}/>
            );
          })}
        </CardContent>
      </Card>
    );
  }

  renderPayment(message) {
    return(
      <Card key={message.guid}>
        <CardHeader
          title={strings.request}
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

// Vendor Imports
import React, {Component} from 'react';
import PropTypes from 'prop-types';
// Project Imports
import Card from '../Card';
import CardContent from '../CardContent';
import CardHeader from '../CardHeader';
import Header from '../Header';
import StatRow from '../StatRow';

// Component Imports
import strings from './strings';

class BountyList extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const {props: {bounties, requestsInProgress, wallet, address,
      onCreateBounty, onCreateOffer, onOpenRelay, onRequestWalletChange }} = this;

    const headerActions = [
      {title: strings.newBounty, onClick: onCreateBounty},
      {title: strings.newOffer, onClick: onCreateOffer},
      {title: strings.relay, onClick: onOpenRelay},
      {title: strings.changeWallet, onClick: onRequestWalletChange},
    ];
    return (
      <div className='BountyList'>
        <Header title={strings.title}
          requests={requestsInProgress}
          back={false}
          actions={headerActions}
          address={address}
          wallet={wallet}/>
        <div className='BountyList-Content'>
          <ul>
            {bounties && bounties.map((bounty, index) => {
              if (bounty.type === 'bounty') {
                return(this.renderBounty(bounty, index));
              } else {
                return(this.renderOffer(bounty, index));
              }
            })}
          </ul>
          {(!bounties || bounties.length === 0) && (
            <div className='BountyList-Placeholder'>
              <h3>
                {strings.empty}
              </h3>
            </div>
          )}
        </div>
      </div>
    );
  }

  onBountySelected(index) {
    const {props: {onBountySelected}} = this;
    if (onBountySelected) {
      onBountySelected(index);
    }
  }

  onBountyRemoved(index) {
    const {props: {onBountyRemoved}} = this;
    if (onBountyRemoved) {
      onBountyRemoved(index);
    }
  }

  renderBounty(bounty, index) {
    let title = bounty.guid;
    if (bounty.resolved) {
      title += strings.resolved;
    } else if (bounty.expired) {
      title += strings.expired;
    } else {
      title += strings.active;
    }
    let subheader = null;
    if (typeof bounty.amount != 'undefined') {
      subheader = bounty.amount + strings.nct;
    }
    let artifacts = '';
    if (bounty.artifacts && bounty.artifacts.length > 0) {
      artifacts = bounty.artifacts.map((artifact) => artifact.name).reduce((csv, name) => csv + ', ' + name);
    }
    let assertions = 0;
    if (bounty && bounty.assertions) {
      assertions = bounty.assertions.length;
    }
    return (
      <Card key={title}
        onClick={() => this.onBountySelected(index)}>
        <CardHeader title={title}
          update={bounty.updated}
          subhead={subheader}
          remove={() => this.onBountyRemoved(index)}
          view={() => this.onBountySelected(index)}
        />
        <CardContent>
          <ul>
            <StatRow title={strings.author}
              content={bounty.author}/>
            <StatRow title={strings.assertions}
              content={assertions}/>
            <StatRow title={strings.files}
              content={artifacts}/>
          </ul>
        </CardContent>
      </Card>
    );
  }

  renderOffer(offer, index) {
    let title = offer.guid;
    if (offer.closed) {
      title += strings.resolved;
    } else {
      title += strings.active;
    }

    let subheader = null;
    if (typeof offer.initial != 'undefined') {
      subheader = offer.initial + strings.nct;
    }

    let messages = 0;
    let lastPay;
    let artifacts = [];
    if (offer.messages) {
      messages = offer.messages.length;
      const payouts = offer.messages
        .filter((message) => message.type==='payment');
      if (payouts.length > 0) {
        lastPay = payouts[0].amount + strings.nct;
      } else {
        lastPay = strings.never;
      }

      const names = offer.messages
        .filter((message) => message.type==='request')
        .map((message) => message.artifacts)
        .reduce((all, artifacts) => all.concat(artifacts), [])
        .sort((a, b) => {
          return a.name > b.name;
        })
        .map((artifact) => artifact.name);
      if (names.length > 0) {
        artifacts = names.reduce((accumulator, artifact) => accumulator +', '+ artifact);
      }
    }

    return (
      <Card key={title}
        onClick={() => this.onBountySelected(index)}>
        <CardHeader title={title}
          update={offer.updated}
          subhead={subheader}
          remove={() => this.onBountyRemoved(index)}
          view={() => this.onBountySelected(index)}
        />
        <CardContent>
          <ul>
            <StatRow title={strings.author}
              content={offer.author}/>
            <StatRow title={strings.expert}
              content={offer.expert}/>
            <StatRow title={strings.lastPay}
              content={lastPay}/>
            <StatRow title={strings.messages}
              content={messages}/>
            <StatRow title={strings.files}
              content={artifacts}/>
          </ul>
        </CardContent>
      </Card>
    );
  }
}
BountyList.proptypes = {
  address: PropTypes.string,
  bounties: PropTypes.array,
  onBountySelected: PropTypes.func,
  onBountyRemoved: PropTypes.func,
  onCreateBounty: PropTypes.func,
  onCreateOffer: PropTypes.func,
  requestsInProgress: PropTypes.array,
  wallet: PropTypes.object,
  onRequestWalletChange: PropTypes.func,
};
export default BountyList;
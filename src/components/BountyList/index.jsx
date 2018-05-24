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
    const {props: {bounties, requestsInProgress, walletList, address,
      onCreateBounty, onCreateOffer}} = this;

    const wallet = walletList[address] || {address: null, eth: null, nct: null};

    const headerActions = [
      {title: strings.newBounty, onClick: onCreateBounty},
      {title: strings.newOffer, onClick: onCreateOffer},
      {title: strings.relay, onClick: () => {}},
    ];
    return (
      <div className='BountyList'>
        <Header title={strings.title}
          requests={requestsInProgress}
          back={false}
          actions={headerActions}
          address={wallet.address}
          nct={wallet.nct}
          eth={wallet.eth}/>
        <div className='BountyList-Content'>
          <ul>
            {bounties && bounties.map((bounty, index) => {
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
              let files = '';
              if (bounty.artifacts && bounty.artifacts.length > 0) {
                files = bounty.artifacts.map((artifact) => artifact.name).reduce((csv, name) => csv + ', ' + name);
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
                        content={files}/>
                    </ul>
                  </CardContent>
                </Card>
              );
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
}
BountyList.proptypes = {
  bounties: PropTypes.array,
  onBountySelected: PropTypes.func,
  onBountyRemoved: PropTypes.func,
};
// const {props: {bounties, requestsInProgress, walletList, address,
//   onCreateBounty, onCreateOffer}} = this;
export default BountyList;
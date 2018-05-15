// Vendor Imports
import React, {Component} from 'react';
import PropTypes from 'prop-types';
// Bounty Management Imports
import Card from '../Card';

// Component Imports
import strings from './strings';

class BountyList extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const {props: {bounties}} = this;
    return (
      <div className='BountyList'>
        <ul>
          {bounties && bounties.length > 0 && bounties.map((bounty, index) => {
              return (
                <Card
                  key={bounty.guid}
                  onClick={() => this.onBountySelected(index)}>
                  {bounty.guid}
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
    );
  }

  onBountySelected(index) {
    const {props: {onBountySelected}} = this;
    if (onBountySelected) {
      onBountySelected(index);
    }
  }
}
BountyList.proptypes = {
  bounties: PropTypes.array,
  onBountySelected: PropTypes.func,
}
export default BountyList;
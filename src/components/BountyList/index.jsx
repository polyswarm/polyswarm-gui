// Vendor Imports
import React, {Component} from 'react';
import PropTypes from 'prop-types';
// Bounty Management Imports
import Button from '../Button'
import Card from '../Card';
import CardButtonRow from '../CardButtonRow';
import CardHeader from '../CardHeader';

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
                  key={bounty.guid}>
                    <CardHeader title={bounty.guid}/>
                    <CardButtonRow>
                      <Button 
                        flat
                        onClick={() => this.onBountySelected(index)}>
                        {strings.view}
                      </Button>
                      <Button 
                          flat
                          cancel
                          onClick={() => this.onBountyRemoved(index)}>
                          {strings.delete}
                        </Button>
                    </CardButtonRow>
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
}
export default BountyList;
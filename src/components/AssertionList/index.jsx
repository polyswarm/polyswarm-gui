import React, { Component } from 'react';
import PropTypes from 'prop-types';
// Bounty imports
import AssertionRow from '../AssertionRow';
// Component imports
import strings from './strings';

class AssertionList extends Component {

  render() {
    const { props: { bounty } } = this;
    const artifacts = bounty.artifacts || [];
    const assertions = bounty.assertions || [];
    return (
      <ul className='AssertionList'>
        {
          /*
            * FIXME We need some sort of time/block number for the assertions.
            * Using index in the key, is bad form (and issues warnings.)
            */
          assertions.map((assertion, index) => {
            return (
              <AssertionRow
                key={assertion.author+assertion.bid+assertion.metadata+assertion.verdict+index}
                assertion={assertion}
                artifacts={artifacts}/>
            );
          })
        }
      </ul>
    );
  }
}
AssertionRow.proptypes = {
  bounty: PropTypes.object.isRequired,
};
export default AssertionList;

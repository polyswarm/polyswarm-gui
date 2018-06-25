// Vendor imports
import React, { Component } from 'react';
import PropTypes from 'prop-types';
// Bounty imports
import StatRow from '../StatRow';
// Component imports
import strings from './strings';

class BountySummary extends Component {
  render() {
    const {
      props: { bounty }
    } = this;
    const assertions = bounty.assertions || [];
    const artifacts = bounty.artifacts || [];
    return (
      <div className="BountySummary">
        <StatRow vertical title={strings.poster} content={bounty.author} />
        <StatRow
          vertical
          title={strings.resolved}
          content={bounty.resolved ? strings.yes : strings.no}
        />
        <StatRow
          vertical
          title={strings.expired}
          content={bounty.expired ? strings.yes : strings.no}
        />
        <StatRow
          vertical
          title={strings.reward}
          content={`${bounty.amount}${strings.nectar}`}
        />
        <StatRow
          vertical
          title={strings.assertions}
          content={assertions.length}
        />
        <StatRow vertical title={strings.directory} content={bounty.uri} />
        {artifacts.map((artifact, index) => {
          let verdict = false;
          if (assertions.length > 0) {
            verdict = assertions
              .map(assertion => assertion.verdicts[index])
              .reduce((accumulator, verdict) => accumulator || verdict);
          }
          let content = verdict ? strings.malicious : strings.safe;
          if (!bounty.resolved && !bounty.expired) {
            content = strings.pending;
          }
          return (
            <StatRow
              key={artifact.name}
              vertical
              title={artifact.name}
              content={content}
            />
          );
        })}
      </div>
    );
  }
}
BountySummary.proptypes = {
  bounty: PropTypes.object.isRequired
};
export default BountySummary;

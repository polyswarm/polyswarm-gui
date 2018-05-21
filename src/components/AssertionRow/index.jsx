import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
// Component Imports
import Card from '../Card';
import CardHeader from '../CardHeader';
import CardContent from '../CardContent';
import StatRow from '../StatRow';
import strings from './strings';

class AssertionRow extends Component {
  render() {
    const { props: { assertion, artifacts } } = this;
    const worstVerdict = assertion.verdicts.reduce((accumulator, verdict) => accumulator || verdict);
    const verdictClass = classNames({
      'Assertion-Malignant': worstVerdict,
      'Assertion-Benign': !worstVerdict
    });
    let subheader = null;
    if (typeof assertion.bid != 'undefined') {
      subheader = assertion.bid + strings.nct;
    }
    let title = `${strings.author}${assertion.author}`;

    return (
      <Card key={title}>
        <CardHeader additionalClasses={verdictClass}
          title={title}
          update={false}
          subhead={subheader}/>
        <CardContent>
          <ul>
            <StatRow title={strings.metadata}
              content={assertion.metadata}/>
            {artifacts.map((file, index) => {
              const verdict = assertion.verdicts[index] ? strings.bad : strings.good;
              const filename = artifacts[index].name;
              return(
                <StatRow key={filename}
                  title={filename}
                  content={verdict} />
              );
            })}
          </ul>
        </CardContent>
      </Card>
    );
  }

  static computeClass(verdict) {
    if (verdict) {
      return 'Malignant';
    } else {
      return 'Benign';
    }
  }

}

AssertionRow.proptypes = {
  assertion: PropTypes.object.isRequired,
  artifacts: PropTypes.array,
};
export default AssertionRow;

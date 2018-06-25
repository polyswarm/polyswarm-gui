import React, { Component } from 'react';
import PropTypes from 'prop-types';

class FileResult extends Component {
  render() {
    const {
      props: { children, good, total }
    } = this;
    const indicator = FileResult.computeIndicator(good, total);
    return (
      <div className="FileResult">
        <span className="FileResult-Name">{children}</span>
        {indicator && (
          <span className={`FileResult-Indicator-${indicator}`}>
            {good}
            {' / '}
            {total}
          </span>
        )}
      </div>
    );
  }

  static computeIndicator(good, total) {
    const ratio = good / total;
    if (good == null || total == null || total === 0) {
      return null;
    } else if (ratio >= 0.7) {
      return 'Good';
    } else if (ratio >= 0.5) {
      return 'Warning';
    } else {
      return 'Bad';
    }
  }
}

FileResult.proptypes = {
  name: PropTypes.string.isRequired,
  good: PropTypes.number,
  total: PropTypes.number
};
export default FileResult;

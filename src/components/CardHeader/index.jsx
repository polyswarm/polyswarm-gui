// Vendor Imports
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
// Bounty Management Imports

// Component Imports

class CardHeader extends Component {
  render() {
    const {props: {title, subhead, update}} = this;
    const classname = classNames('CardHeader', {'update': update})
    return (
      <header className={classname}>
        {title}
        {subhead && subhead.length > 0 && (
          <p className='CardSubHeader'>
            {subhead}
          </p>
        )}
      </header>
    );
  }
}
CardHeader.proptypes = {
  title: PropTypes.string,
  subhead: PropTypes.string,
}
export default CardHeader;
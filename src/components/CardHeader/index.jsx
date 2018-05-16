// Vendor Imports
import React, {Component} from 'react';
import PropTypes from 'prop-types';
// Bounty Management Imports

// Component Imports

class CardHeader extends Component {
  render() {
    const {props: {title, subhead}} = this;
    return (
      <header className='CardHeader'>
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
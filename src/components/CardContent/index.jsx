// Vendor imports
import React, {Component} from 'react';
import PropTypes from 'prop-types';

// Project imports

// Component imports

class CardContent extends Component {
  render() {
    const {props: {children}} = this;
    return (
      <div className='CardContent'>
        {children}
      </div>
    );
  }
}
CardContent.proptypes = {

};
export default CardContent;
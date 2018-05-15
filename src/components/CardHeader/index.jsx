// Vendor Imports
import React, {Component} from 'react';
import PropTypes from 'prop-types';
// Bounty Management Imports

// Component Imports

class CardHeader extends Component {
    render() {
        const {props: {title}} = this;
        return (
            <div className='CardHeader'>
                {title}
            </div>
        );
    }
}
CardHeader.proptypes = {
    title: PropTypes.string,
}
export default CardHeader;
// Vendor Imports
import React, {Component} from 'react';
import PropTypes from 'prop-types';
// Bounty Management Imports

// Component Imports
import strings from './strings';

class Card extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        const {props: {children}} = this;
        return (
            <div className='Card'>
                {children}
            </div>
        );
    }
}
Card.proptypes = {
    
}
export default Card;
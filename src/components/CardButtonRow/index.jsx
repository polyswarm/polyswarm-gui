// Vendor Imports
import React, {Component} from 'react';
import PropTypes from 'prop-types';
// Bounty Management Imports

// Component Imports

class CardButtonRow extends Component {
    render() {
        const {props: {children}} = this;
        return (
            <div className='CardButtonRow'>
                {React.Children.map(children, (child) => {
                  return (
                    <div
                      key={child.textconent}
                      className='ButtonWrap'>
                      {child}
                    </div>
                  ); 
                })}
            </div>
        );
    }
}
CardButtonRow.proptypes = {
    title: PropTypes.string,
}
export default CardButtonRow;
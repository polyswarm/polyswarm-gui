// Vendor imports
import React, { Component } from 'react';
import PropTypes from 'prop-types';

class CSSTransition extends Component {
  render() {
    const show = this.props.in;
    const {props: {children, enterOnMount}} = this;
    return (
      <div>
        {(show || !enterOnMount) && (
          <div>
            {children('entered')}
          </div>
        )}
      </div>
    );
  }

  onExited() {
    const {props: {onExited}} = this;
    onExited();
  }

}
CSSTransition.proptypes = {
  children: PropTypes.func
};

class TransitionGroup extends Component {
  render() {
    const {props: {children}} = this;
    let modified;
    if (children != null) {
      modified = React.Children.map(children, child => {
        if (child != null) {
          return React.cloneElement(child, {in: true});
        } else {
          return child;
        }
      });
    }
    return(
      <div>
        {modified}
      </div>
    );
  }
}
export {CSSTransition, TransitionGroup};
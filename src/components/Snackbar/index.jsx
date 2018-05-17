// Vendor imports
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {CSSTransition} from 'react-transition-group';
// Project imports
import Button from '../Button';
// Component imports
import strings from './strings';
class Snackbar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show: true,
    };
    this.dismiss = this.dismiss.bind(this);
    this.hide = this.hide.bind(this);
  }

  render() {
    const { props: {message}, state: {show} } = this;
    return(
      <CSSTransition
        in={show}
        appear
        timeout={300}
        onExited={this.dismiss}
        classNames='snackbar'>
        {() =>(
          <div className='Snackbar'>
            <p>
              {message}
            </p>
            <Button flat
              onClick={this.hide}>
              {strings.dismiss}
            </Button>
          </div>
        )}
      </CSSTransition>
    );
  }

  hide() {
    this.setState({show: false});
  }

  dismiss() {
    const { onDismiss } = this.props;
    if (onDismiss) {
      onDismiss();
    }
    this.setState({show: true});
  }
}
Snackbar.proptypes = {
  message: PropTypes.string,
  onDismiss: PropTypes.func
};
export default Snackbar;
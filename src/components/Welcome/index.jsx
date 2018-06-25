// Vendor imports
import React, { Component } from 'react';
import PropTypes from 'prop-types';
// Bounty imports
import Button from '../Button';
// Component Imports
import strings from './strings';

class Welcome extends Component {
  constructor(props) {
    super(props);
    this.onClickHandler = this.onClickHandler.bind(this);
  }

  render() {
    return (
      <div className="Welcome">
        <div className="Welcome-Jumbo">
          <h1>{strings.welcome}</h1>
          <h2>
            The first <em>decentralized</em> antivirus marketplace.
          </h2>
          <p>{strings.moreInfo}</p>
          <Button className="Welcome-Close" onClick={this.onClickHandler}>
            {strings.getStarted}
          </Button>
        </div>
      </div>
    );
  }

  onClickHandler() {
    const {
      props: { onClick }
    } = this;
    if (onClick) {
      onClick();
    }
  }
}

Welcome.propTypes = {
  onClick: PropTypes.func
};
export default Welcome;

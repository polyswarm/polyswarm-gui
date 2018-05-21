import React, { Component } from 'react';
import PropTypes from 'prop-types';
// Bounty imports
import Button from '../Button';
import RequestSpinner from '../RequestSpinner';
// Component imports
import strings from './strings';

class Header extends Component {
  constructor(props) {
    super(props);
    this.onClickHandler = this.onClickHandler.bind(this);
    this.onBack = this.onBack.bind(this);
  }

  render() {
    const { props: { title, create, active, requests } } = this;
    let image_path = '../public/img/polyswarm-white.svg';
    if (create || active >= 0) {
      image_path = '../public/img/back-arrow.svg';
    }
    return (
      <header className='Header'>
        <div className='Header-Title'>
          <img onClick={this.onBack} 
            className='Header-Logo'
            src={image_path}
            alt={strings.logo}/>
          <h3>{title}</h3>
          <RequestSpinner requests={requests}/>
        </div>
        {active < 0 && !create && (
          <Button className='Header-Button' onClick={this.onClickHandler}>
            {strings.newBounty}
          </Button>
        )}
      </header>
    );
  }

  onBack() {
    const { props: { onBack } } = this;
    if(onBack) {
      onBack();
    } 
  }

  onClickHandler() {
    const { props: { onClick } } = this;
    if(onClick) {
      onClick();
    }
  }
}

Header.propTypes = {
  title: PropTypes.string,
  onClick: PropTypes.func,
  onBack: PropTypes.func,
  create: PropTypes.bool,
  requests: PropTypes.array,
};
export default Header;

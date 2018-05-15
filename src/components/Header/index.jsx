import React, { Component } from 'react';
// Bounty imports
import Button from '../Button';
import PropTypes from 'prop-types';
// Component imports
import strings from './strings';

class Header extends Component {
  constructor(props) {
    super(props);
    this.onClickHandler = this.onClickHandler.bind(this);
  }

  render() {
    const { props: { title, create } } = this;
    return (
      <header className='Header'>
        <div className='Header-Title'>
          <img className='Header-Logo'
              src='../public/img/polyswarm.svg'
              alt={strings.logo}/>
          <h3>{title}</h3>
        </div>
        {!create && (
          <Button className='Header-Button' onClick={this.onClickHandler}>
            {strings.newBounty}
          </Button>
        )}
      </header>
    );
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
  create: PropTypes.bool,
};
export default Header;

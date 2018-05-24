import React, { Component } from 'react';
import PropTypes from 'prop-types';
// Bounty imports
import Button from '../Button';
import RequestSpinner from '../RequestSpinner';
import Dropdown from '../Dropdown';
// Component imports
import strings from './strings';
class Header extends Component {
  constructor(props) {
    super(props);
    this.onBountyClickHandler = this.onBountyClickHandler.bind(this);
    this.onOfferClickHandler = this.onOfferClickHandler.bind(this);
    this.onBack = this.onBack.bind(this);
  }

  render() {
    const { props: { title, back, requests, actions, address, nct, eth } } = this;
    let image_path = '../public/img/polyswarm-white.svg';
    if (back) {
      image_path = '../public/img/back-arrow.svg';
    }
    return (
      <header className='Header'>
        <div className='Header-Row'>
          <div className='Header-Title'>
            <img onClick={this.onBack}
              className='Header-Logo'
              src={image_path}
              alt={strings.logo}/>
            <h3>{title}</h3>
            <RequestSpinner requests={requests}/>
          </div>
          {!back && (
            <div className='Header-Actions'>
              {actions.slice(0, 2).map((action) => {
                return(
                  <Button key={action.title}
                    onClick={action.onClick}
                    header>
                    {action.title}
                  </Button>
                );
              })}
              {actions.slice(2).length > 0 && (
                <Dropdown light>
                  {actions.slice(2).map((action) => {
                    return(
                      <p key={action.title}
                        onClick={action.onClick}>
                        {action.title}
                      </p>
                    );
                  })}
                </Dropdown>
              )}
            </div>
          )}
        </div>
        <div className='Header-Address'>
          <p className='Header-Divided'>
            {address}
          </p>
          <p className='Header-Divided'>
            {`${strings.mainnet}${nct}${strings.nct}${eth}${strings.eth}`}
          </p>
          <p>
            {`${strings.sidenet}${nct}${strings.nct}`}
          </p>
        </div>
      </header>
    );
  }

  onBack() {
    const { props: { onBack } } = this;
    if(onBack) {
      onBack();
    } 
  }

  onBountyClickHandler() {
    const { props: { onClick } } = this;
    if(onClick) {
      onClick();
    }
  }

  onOfferClickHandler() {
    const { props: { onOfferClick } } = this;
    if(onOfferClick) {
      onOfferClick();
    }
  }
}

Header.propTypes = {
  title: PropTypes.string,
  back: PropTypes.bool,
  actions: PropTypes.array,
  address: PropTypes.string,
  nct: PropTypes.string,
  eth: PropTypes.string,
  onBack: PropTypes.func,
  requests: PropTypes.array,

};
export default Header;

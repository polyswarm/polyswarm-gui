// Vendor imports
import React, { Component } from 'react';
import PropTypes from 'prop-types';
// Project imports
import Button from '../Button';
import ChainInfo from '../ChainInfo';
import Dropdown from '../Dropdown';
import Header from '../Header';
import NectarField from '../NectarField';
// Component imports
import strings from  './strings.js';
import './styles.css';

class Landing extends Component {
  constructor(props) {
    super(props);
    this.state = {
        nectar: 0.5,
        selected: 0,
        error: false,
    };

    this.onButtonClick = this.onButtonClick.bind(this);
    this.onNectarChanged = this.onNectarChanged.bind(this);
    this.onSelectionChanged = this.onSelectionChanged.bind(this);
  }

  render() {
    const {state: {error, nectar, selected}, props: {homechain, sidechain, address} } = this;
    const homeAltered = selected == 0 ? homechain.balance - nectar : homechain.balance + nectar;
    const sideAltered = selected == 0 ? sidechain.balance + nectar : sidechain.balance - nectar;
    return(
      <div className='Landing'>
        <Header>
          <h1>{strings.title}</h1>
        </Header>
        <div className='Landing-Content'>
          <h2>{address}</h2>
          <div className='Landing-Chain'>
            <ChainInfo title={strings.before}
              homeName={homechain.name}
              homeBalance={homechain.balance}
              sideName={sidechain.name}
              sideBalance={sidechain.balance} />
            <ChainInfo title={strings.after}
              homeName={homechain.name}q
              homeBalance={homeAltered}
              sideName={sidechain.name}
              sideBalance={sideAltered} />
          </div>
          <div className='Landing-Nectar'>
            <Dropdown onSelectionChanged={this.onSelectionChanged}/>
            <NectarField onChange={this.onNectarChanged}
              nectar={nectar} />
            <Button
              disabled={error || nectar === 0}
              onClick={this.onButtonClick} >
              {strings.transfer}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  onNectarChanged(nectar, valid) {
    this.setState({nectar: nectar, error: !valid});
  }

  onSelectionChanged(index) {
    this.setState({selected: index});
  }

  onButtonClick() {
    const {props: {onTransfer}, state: {nectar, selected}} = this;
    if (onTransfer) {
      onTransfer(nectar, selected);
    }
  }
}
Landing.proptypes = {
  onTransfer: PropTypes.func,
  homechain: PropTypes.object,
  sidechain: PropTypes.object
}
export default Landing;
// Vendor imports
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {CSSTransition} from 'react-transition-group';
// Project imports
import NectarField from '../NectarField';
import Button from '../Button';
import ChainInfo from '../ChainInfo';
import Header from '../Header';
// Component imports
import strings from  './strings.js';
import './styles.css';

class Landing extends Component {
  constructor(props) {
    super(props);
    this.state = {
        nectar: '0.5',
        selected: 0,
        error: false,
    };

    this.onNectarChanged = this.onNectarChanged.bind(this);
    this.onButtonClick = this.onButtonClick.bind(this);
    this.select = this.select.bind(this);
  }

  render() {
    const {state: {error, nectar, selected} } = this;
    return(
      <div className='Landing'>
        <Header>
          <h1>{strings.title}</h1>
        </Header>
        <div className='Landing-Content'>
          <div className='Landing-Chain'>
            <ChainInfo onClick={() => this.select(0)}
              name={'Mainnet'}
              balance={'10'}
              transfer={nectar}
              sender={selected == 0}/>
            <ChainInfo onClick={() => this.select(1)}
              name={'PolySwarm sidechain'}
              balance={'0'}
              transfer={nectar}
              sender={selected == 1}/>
          </div>
          <div className='Landing-Nectar'>
            <NectarField onChange={this.onNectarChanged}
              nectar={nectar} />
            <Button
              disabled={error || nectar == 0}
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

  onButtonClick() {
    const {props: {onTransfer}, state: {nectar, selected}} = this;
    if (onTransfer) {
      onTransfer(nectar, selected);
    }
  }

  select(index) {
    this.setState({selected: index});
  }

}
Landing.proptypes = {
  onTransfer: PropTypes.func
}
export default Landing;
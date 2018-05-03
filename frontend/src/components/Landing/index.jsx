// Vendor imports
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {CSSTransition} from 'react-transition-group';
// Project imports
import NectarField from '../NectarField';
import Button from '../Button';
// Component imports
import strings from  './strings.js';
import './styles.css';

class Landing extends Component {
  constructor(props) {
    super(props);
    this.state = {
        nectar: '',
        error: false,
        hide: false
    };

    this.onNectarChanged = this.onNectarChanged.bind(this);
    this.onButtonClick = this.onButtonClick.bind(this);
  }

  render() {
    const {state: {error, nectar, hide, finished} } = this;
    return(
      <div className='Landing'>
        <div className='Landing-Background'/>
        <div className='Landing-Content'>
          <h1>{strings.title}</h1>
          <div className='Landing-nectar'>
            <CSSTransition
              in={!hide}
              classNames='translate'
              onExited={() => {
                const {props: {onSetNectar}, state: {nectar}} = this;
                if (onSetNectar) {
                  onSetNectar(nectar);
                }
              }}
              timeout={300}>
              {() => (
                <NectarField onChange={this.onNectarChanged}
                  nectar={nectar} />
              )}
            </CSSTransition>
            <Button
              disabled={error || nectar.length == 0}
              onClick={this.onButtonClick} >
              {strings.go}
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
    this.setState({hide: true});
  }

}
Landing.proptypes = {
  onSetNectar: PropTypes.func
}
export default Landing;
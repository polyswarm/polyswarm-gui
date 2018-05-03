// Vendor imports
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import {CSSTransition} from 'react-transition-group';
// Project imports
// Component imports
import strings from './strings';
import './styles.css';

class NectarField extends Component {
  constructor(props) {
    super(props);
    this.state = {
      focused: false,
      error: false,
      first: true,
    }

    this.onBlur = this.onBlur.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onFocus = this.onFocus.bind(this);
    this.getNectar = this.getNectar.bind(this);
  }

  componentDidMount() {
    this.setState({first: false});
  }

  render() {
    const {state: {error, focused} } = this;
    const nectar = this.getNectar();
    const inputClass = classNames('NectarField-Input', {error: error});
    return (
        <div className='NectarField'>
          <CSSTransition
            in={(nectar && nectar.length > 0) || focused}
            timeout={300}
            classNames='label'> 
            {() => (
              <label className='NectarField-Label'
                htmlFor='nectar'>
                {strings.nectar}
              </label>
            )}
          </CSSTransition>
          <input
            className={inputClass}
            id='nectar'
            type='number'
            value={nectar}
            onBlur={this.onBlur}
            onFocus={this.onFocus}
            onChange={this.onChange}/>
        </div>
    );
  }

  onBlur() {
    this.setState({focused: false});
  }

  onChange(e) {
    const {props: {onChange}} = this;
    const nectar = e.target.value;
    const valid = this.validateNectar(nectar)
    if (onChange) {
      onChange(nectar, valid);
    }
    this.setState({error: !valid});
  }

  onFocus() {
    this.setState({focused: true});
  }

  /**
   * This triggers a redraw of the element so we get CSSTransition to animate
   * when the nectar is set as a prop for the first draw.
   */
  getNectar() {
    const { state: {first}, props: {nectar}} = this;
    if (first) {
      return '';
    } else {
      return nectar;
    }
  }

  validateNectar(nectar) {
    return nectar.length == 0 || nectar.length > 14;
  }
}
NectarField.proptypes = {
  onChange: PropTypes.func,
  nectar: PropTypes.string
}
export default NectarField;
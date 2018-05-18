// Vendor imports
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import {CSSTransition} from 'react-transition-group';
// Project imports
// Component imports

class AnimatedInput extends Component {
  constructor(props) {
    super(props);
    this.state = {
      focused: false,
      value: '',
      first: true,
    }

    this.onBlur = this.onBlur.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onFocus = this.onFocus.bind(this);
  }

  componentDidMount() {
    this.setState({first: false});
  }

  render() {
    const {state: {focused, value, first}, props: {placeholder, error, input_id, type} } = this;
    const guaranteedType = type || 'text';
    const valueWithFix = this.getValue(first, value);
    const inputClass = classNames('AnimatedInput-Input', {'AnimatedInput-Error': error});
    return (
        <div className='AnimatedInput'>
          <CSSTransition
            in={(valueWithFix != null && typeof valueWithFix != 'undefined' && valueWithFix.length > 0) || focused}
            timeout={300}
            classNames='label'> 
            {() => (
              <label className='AnimatedInput-Label'
                htmlFor={input_id}>
                {placeholder}
              </label>
            )}
          </CSSTransition>
          <input
            className={inputClass}
            id={input_id}
            type={guaranteedType}
            value={valueWithFix}
            onBlur={this.onBlur}
            onFocus={this.onFocus}
            onChange={this.onChange}/>
          {error && (
            <p className='AnimatedInput-ErrorLabel'>
              {error}
            </p>
          )}
        </div>
    );
  }

  onBlur() {
    this.setState({focused: false});
  }

  onChange(e) {
    const {props: {onChange}} = this;
    const value = e.target.value;
    if (onChange) {
      onChange(value);
    }
    this.setState({value: value});
  }

  onFocus() {
    this.setState({focused: true});
  }

  /**
   * This triggers a redraw of the element so we get CSSTransition to animate
   * when the nectar is set as a prop for the first draw.
   */
  getValue(first, value) {
    if (first) {
      return '';
    } else {
      return value;
    }
  }
}
AnimatedInput.proptypes = {
  onChange: PropTypes.func,
  value: PropTypes.string,
  error: PropTypes.string,
  type: PropTypes.string,
  input_id: PropTypes.string,
  placeholder: PropTypes.string,
}
export default AnimatedInput;
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
    };

    this.onBlur = this.onBlur.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onFocus = this.onFocus.bind(this);
    this.onKeyPress = this.onKeyPress.bind(this);
  }

  componentDidMount() {
    this.setState({first: false});
  }

  static getDerivedStateFromProps(nextProps) {
    const {readonly} = nextProps;
    if (readonly) {
      return {value: readonly};
    } else {
      return null;
    }
  }

  render() {
    const {state: {focused, value, first}, 
      props: {placeholder, error, input_id, type, readonly} } = this;
    const guaranteedType = type || 'text';
    const inputClass = classNames('AnimatedInput-Input', {
      'AnimatedInput-Error': error,
      'AnimatedInput-Readonly': readonly
    });
    return (
      <div className='AnimatedInput'>
        <CSSTransition
          in={(!first && value != null && typeof value != 'undefined' && `${value}`.length > 0) || focused}
          timeout={300}
          classNames='label'> 
          {() => (
            <React.Fragment>
              {(!first && (
                <label className='AnimatedInput-Label'
                  htmlFor={input_id}>
                  {placeholder}
                </label>
              ))}
            </React.Fragment>
          )}
        </CSSTransition>
        <input
          className={inputClass}
          readOnly={readonly}
          id={input_id}
          type={guaranteedType}
          value={value}
          onKeyPress={this.onKeyPress}
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
    const {props: {onChange, readonly}} = this;
    const value = e.target.value;
    if (onChange) {
      onChange(value);
    }
    if (!readonly) {
      this.setState({value: value});
    }
  }

  onFocus() {
    this.setState({focused: true});
  }

  onKeyPress(event) {
    const {props: {onKeyPress}} = this;
    if (onKeyPress) {
      onKeyPress(event);
    }
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
  onKeyPress: PropTypes.func,
  value: PropTypes.string,
  error: PropTypes.string,
  type: PropTypes.string,
  input_id: PropTypes.string,
  placeholder: PropTypes.string,
};
export default AnimatedInput;
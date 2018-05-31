// Vendor imports
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
// Component imports
import strings from './strings';

class FileButton extends Component {
  constructor(props) {
    super(props);
    this.onFileChanged = this.onFileChanged.bind(this);
  }

  render() {
    const {props: {flat, multiple} } = this;
    const labelClass = classNames('LabelButton', {'flat': flat});
    return(
      <React.Fragment>
        <input id='file'
          ref={((input)=> this.input = input)}
          className='hidden'
          type='file'
          onChange={this.onFileChanged}
          multiple={multiple}/>
        <label 
          className={labelClass}
          htmlFor='file'>{strings.selectFile}</label>
      </React.Fragment>
    );
  }

  onFileChanged(event) {
    const {onFileSelected} = this.props;
    if (onFileSelected && event.target.files && event.target.files.length >= 1) {
      const files = [];
      for (var i = 0; i < event.target.files.length; i++) {
        files.push(event.target.files[i]);
      }
      onFileSelected(files);
    }
    this.input.value = null;
  }
}

FileButton.propTypes = {
  onFileSelected: PropTypes.func,
  multiple: PropTypes.bool,
};
export default FileButton;

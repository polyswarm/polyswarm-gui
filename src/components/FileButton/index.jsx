// Vendor imports
import React, {Component} from 'react';
// Component imports
import './styles.css';
import strings from './strings';

class FileButton extends Component {
  constructor(props) {
    super(props);
    this.onFileChanged = this.onFileChanged.bind(this);
  }

  render() {
    return(
      <form>
        <input id='file' className='hidden' type='file' onChange={this.onFileChanged} />
        <label htmlFor='file'>{strings.selectFile}</label>
      </form>
    );
  }

  onFileChanged(event) {
    const {onFileSelected} = this.props;
    if (onFileSelected && event.target.value) {
        onFileSelected(event.target.value);
    }
  }
}
export default FileButton;
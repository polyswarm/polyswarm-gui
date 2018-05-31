// Vendor imports
import React, {Component} from 'react';
import PropTypes from 'prop-types';
// Bounty imports
import FileButton from '../FileButton';
// Component imports
import strings from './strings';

class DropTarget extends Component {
  constructor(props) {
    super(props);
    this.onDropHandler = this.onDropHandler.bind(this);
    this.onDragOverHandler = this.onDragOverHandler.bind(this);
    this.onDragEnterHandler = this.onDragEnterHandler.bind(this);
    this.onDragLeaveHandler = this.onDragLeaveHandler.bind(this);
    this.onFileSelectedHandler = this.onFileSelectedHandler.bind(this);
  }

  render() {
    return(
      <div className='Drop-Target'
        ref={(target) => {this.target = target;}}
        onDrop={this.onDropHandler}
        onDragOver={this.onDragOverHandler}
        onDragEnter={this.onDragEnterHandler}
        onDragLeave={this.onDragLeaveHandler}>
        <div>
          <p>{strings.dragAndDrop}</p>
          <form>
            <FileButton 
              multiple
              onFileSelected={this.onFileSelectedHandler}>
              {strings.selectFile}
            </FileButton>
          </form>
        </div>
      </div>
    );
  }

  onDropHandler(event) {
    const { props: { onFilesSelected } } = this;
    // Don't want file to open
    event.preventDefault();

    let files = [];

    if (onFilesSelected) {
      if (event.dataTransfer.items) {
        const items = event.dataTransfer.items;
        for (var i = 0; i < items.length; i++) {
          const item = items[i];
          if (item.kind === 'file') {
            files.push(item.getAsFile());
          }
        }
      } else {
        files = event.dataTransfer.files;
      }

      if (files.length > 0) {
        onFilesSelected(files);
      }
    }

    this.removeDragData(event);
    this.target.classList.remove('drag');
  }

  onDragOverHandler(event) {
    event.preventDefault();
  }

  onDragEnterHandler(event) {
    event.preventDefault();
    this.target.classList.add('drag');
  }

  onDragLeaveHandler(event) {
    event.preventDefault();
    this.target.classList.remove('drag');
  }

  onFileSelectedHandler(file) {
    const { props: { onFilesSelected } } = this;
    if (onFilesSelected) {
      onFilesSelected(file);
    }
  }

  removeDragData(event) {
    if (event.dataTransfer.items) {
      event.dataTransfer.items.clear();
    } else {
      event.dataTransfer.clearData();
    }
  }
}

DropTarget.propTypes = {
  onFilesSelected: PropTypes.func,
};
export default DropTarget;

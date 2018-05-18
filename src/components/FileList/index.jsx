// Vendor imports
import React from 'react';
import PropTypes from 'prop-types';
import {TransitionGroup, CSSTransition} from 'react-transition-group';
// Bounty imports
import ListItem from '../ListItem';
import Button from '../Button';
import FileResult from '../FileResult';
// Component Imports
import strings from './strings';

class FileList  extends React.Component {
  constructor(props) {
    super(props);
    this.onRemoveClickHandler = this.onRemoveClickHandler.bind(this);
    this.onClearClickHandler = this.onClearClickHandler.bind(this);
  }

  render () {
    const { props: { files, readonly, active } } = this;
    return (
      <div className='File-List'>
        <header className='File-List-Header'>
          <p className='File-List-Title'>
            {files.length}{' '}{strings.title}
          </p>
          {!readonly && (
            <Button className='Clear-Button'
              flat
              cancel
              disabled={files.length === 0}
              onClick={this.onClearClickHandler}>
              {strings.clearAll}
            </Button>
          )}
        </header>
        <ul className='List'>
          <TransitionGroup>
            {files.map((f, index) => {
              const name = f.name;
              let remove = () => {this.onRemoveClickHandler(index);};
              const onClick = () => {this.onClickHandler(index);};
              if (readonly) {
                remove = null;
              }
              return(
                <CSSTransition
                  key={name}
                  timeout={300}
                  classNames='item'>
                  {() => (
                    <ListItem
                      alternate
                      active={index === active}
                      className={`item-${index}`}
                      onClick={onClick}
                      remove={remove}>
                      <FileResult good={f.good} total={f.total}>
                        {name}
                      </FileResult>
                    </ListItem>
                  )}
                </CSSTransition>
              );
            })}
          </TransitionGroup>
        </ul>
      </div>
    );
  }

  onClickHandler(index) {
    const { props: { onClick } } = this;
    if (onClick) {
      onClick(index);
    }
  }

  onRemoveClickHandler(index) {
    const { props: { removeFile } } = this;
    if (removeFile) {
      removeFile(index);
    }
  }

  onClearClickHandler() {
    const { props: { clear } } = this;
    if (clear) {
      clear();
    }
  }
}

FileList.proptypes = {
  files: PropTypes.array.isRequired,
  removeFile: PropTypes.func.isRequired,
  readonly: PropTypes.bool,
};

export default FileList;

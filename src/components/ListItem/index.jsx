import React, { Component } from 'react';
import PropTypes from 'prop-types';
// Bounty imports
import RemoveButton from '../RemoveButton';
// Component imports
import strings from './strings';

class ListItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hover: false
    };

    this.onClickHandler = this.onClickHandler.bind(this);
    this.onRemoveHandler = this.onRemoveHandler.bind(this);
    this.onMouseEnter = this.onMouseEnter.bind(this);
    this.onMouseLeave = this.onMouseLeave.bind(this);
  }

  render() {
    const {
      props: { children, remove, active, alert, alternate },
      state: { hover }
    } = this;
    const className = ListItem.computeClassName(active, alternate);
    return (
      <li
        className={className}
        onMouseEnter={this.onMouseEnter}
        onMouseLeave={this.onMouseLeave}
      >
        <div>
          {alert && <div className="alert" />}
          <span className="ListItem-Child" onClick={this.onClickHandler}>
            {children}
          </span>
        </div>
        {remove &&
          hover && (
            <span className="ListItem-Remove">
              <RemoveButton onClick={this.onRemoveHandler}>
                <img
                  className="redx"
                  src="../public/img/red-x.svg"
                  alt={strings.remove}
                />
              </RemoveButton>
            </span>
          )}
      </li>
    );
  }

  onClickHandler() {
    const {
      props: { onClick }
    } = this;
    if (onClick) {
      onClick();
    }
  }

  onRemoveHandler() {
    const {
      props: { remove }
    } = this;
    if (remove) {
      remove();
    }
  }

  onMouseEnter() {
    this.setState({ hover: true });
  }

  onMouseLeave() {
    this.setState({ hover: false });
  }

  static computeClassName(active, alternate) {
    if (active && !alternate) {
      return 'ListItem active';
    } else if (alternate && active) {
      return 'ListItem alternate';
    } else {
      return 'ListItem';
    }
  }
}

ListItem.proptypes = {
  item: PropTypes.string.isRequired,
  remove: PropTypes.func
};

export default ListItem;

// Vendor Imports
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
// Project Imports
import Dropdown from '../Dropdown';
// Component Imports
import strings from './strings';

class CardHeader extends Component {
  constructor(props) {
    super(props);
    this.remove = this.remove.bind(this);
    this.view = this.view.bind(this);
  }

  render() {
    const {props: {title, subhead, update, remove, view, additionalClasses}} = this;
    const classname = classNames('CardHeader', additionalClasses, {'update': update });
    return (
      <header className={classname}>
        <div className='CardHeader-Title'>
          {title}
          {subhead && subhead.length > 0 && (
            <p className='CardHeader-Sub'>
              {subhead}
            </p>
          )}
        </div>
        {remove && view && (
          <Dropdown>
            <p onClick={this.view}>
              {strings.view}
            </p>
            <p onClick={this.remove}>
              {strings.delete}
            </p>
          </Dropdown>
        )}
      </header>
    );
  }

  remove(e) {
    e.stopPropagation();
    const {props: { remove }} = this;
    if (remove) {
      remove();
    }
  }

  view(e) {
    e.stopPropagation();
    const {props: {view}} = this;
    if (view) {
      view();
    }
  }
}
CardHeader.proptypes = {
  title: PropTypes.string,
  subhead: PropTypes.string,
  remove: PropTypes.func,
  view: PropTypes.func,
}
export default CardHeader;
// Vendor imports
import React, { Component } from 'react';
import PropTypes from 'prop-types';
// Project imports
// Component imports
import strings from './strings.js';

class RelayDropdown extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: 0
    };

    this.onSelectionChanged = this.onSelectionChanged.bind(this);
  }

  render() {
    const {
      state: { selected }
    } = this;
    return (
      <div className="RelayDropdown">
        <p className="RelayDropdown-Selection">
          {selected == 0 ? strings.deposit : strings.withdraw}
        </p>
        <div className="RelayDropdown-Choices">
          <p onClick={() => this.onSelectionChanged(0)}>{strings.deposit}</p>
          <p onClick={() => this.onSelectionChanged(1)}>{strings.withdraw}</p>
        </div>
      </div>
    );
  }

  onSelectionChanged(index) {
    const {
      props: { onSelectionChanged },
      state: { selected }
    } = this;
    if (index == selected) {
      return;
    }

    if (onSelectionChanged) {
      onSelectionChanged(index);
    }
    this.setState({ selected: index });
  }
}
RelayDropdown.proptypes = {
  onSelectionChanged: PropTypes.func
};
export default RelayDropdown;

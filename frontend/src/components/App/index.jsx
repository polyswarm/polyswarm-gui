import React, { Component } from 'react';
import {CSSTransition} from 'react-transition-group';
import Landing from '../Landing';
import './styles.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nectar: '',
    }

    this.onSetNectar = this.onSetNectar.bind(this);
  }

  render() {
    const {state: {nectar}} = this;
    return (
      <div className="App">
        <Landing onSetNectar={this.onSetNectar}/>
      </div>
    );
  }

  onSetNectar(nectar) {
    this.setState({nectar: nectar});
  }
}

export default App;

import React, { Component } from 'react';
import {CSSTransition} from 'react-transition-group';
import Landing from '../Landing';
import Transfer from '../Transfer';
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
        <CSSTransition
          in={nectar.length == 0}
          classNames='fade'
          unmountOnExit
          timeout={300}>
          {() => (
            <Landing onSetNectar={this.onSetNectar}/>
          )}
        </CSSTransition>
        <CSSTransition
          in={nectar.length > 0}
          classNames='fade'
          timeout={300}>
          {() => (
            <Transfer nectar={nectar}/>
          )}
        </CSSTransition>
      </div>
    );
  }

  onSetNectar(nectar) {
    this.setState({nectar: nectar});
  }
}

export default App;

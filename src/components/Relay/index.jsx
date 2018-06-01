// Vendor imports
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import BigNumber from 'bignumber.js';
import Uuid from 'uuid/v4';
// Project imports
import AnimatedInput from '../AnimatedInput';
import Button from '../Button';
import ChainInfo from '../ChainInfo';
import Header from '../Header';
import RelayDropdown from '../RelayDropdown';
// Component imports
import strings from  './strings.js';
import HttpRelay from './http';

class Relay extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nectar: '',
      selected: 0,
      nectar_error: strings.disabled,
    };

    this.onButtonClick = this.onButtonClick.bind(this);
    this.onNectarChanged = this.onNectarChanged.bind(this);
    this.onSelectionChanged = this.onSelectionChanged.bind(this);
    this.handleError = this.handleError.bind(this);
    this.transfer = this.transfer.bind(this);
    this.addRelayRequest = this.addRelayRequest.bind(this);
    this.removeRelayRequest = this.removeRelayRequest.bind(this);
  }

  componentDidMount() {
    const { props: { url } } = this;
    this.http = new HttpRelay(url);
  }

  render() {
    const {state: {nectar_error, nectar, selected},
      props: {address, wallet, onBackPressed, requestsInProgress } } = this;

    let homeAltered ='0';
    let sideAltered ='0';
    if (wallet.homeNct && wallet.sideNct) {
      let nct = nectar;
      if (!nectar) {
        nct = 0;
      }
      homeAltered = new BigNumber(wallet.homeNct).minus(new BigNumber(`${selected? '-' : ''}${nct}`)).toString();
      sideAltered = new BigNumber(wallet.sideNct).plus(new BigNumber(`${selected? '-' : ''}${nct}`)).toString();
    }
    return(
      <div className='Relay'>
        <Header title={strings.title}
          requests={requestsInProgress}
          back={true}
          onBack={onBackPressed}
          address={address}
          wallet={wallet}/>
        <div className='Relay-Content'>
          <div className='Relay-Centered'>
            <div className='Relay-Chain'>
              <ChainInfo title={strings.before}
                homeName={strings.main}
                homeBalance={wallet.homeNct}
                sideName={strings.side}
                sideBalance={wallet.sideNct} />
              <ChainInfo title={strings.after}
                homeName={strings.main}
                homeBalance={homeAltered}
                sideName={strings.side}
                sideBalance={sideAltered} />
            </div>
            <div className='Relay-Nectar'>
              <RelayDropdown onSelectionChanged={this.onSelectionChanged}/>
              <AnimatedInput type='number'
                input_id='nectar'
                error={nectar_error}
                placeholder={strings.nectar}
                onChange={this.onNectarChanged} />
            </div>
            <div className='Relay-Button'>
              <Button
                disabled={true || nectar_error || !nectar}
                onClick={this.onButtonClick} >
                {strings.transfer}
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  onButtonClick() {
    const { state: {selected} } =this;
    if (selected == 1) {
      // return this.transfer(false);
    } else {
      // return this.transfer(true);
    }
  }
  
  onNectarChanged(nectar) {
    const { state: {selected}, props: {wallet}} = this;

    let max = selected == 0 ? wallet.homeNct : wallet.sideNct;
    let error = null;
    if (nectar && nectar.length > 0 && new BigNumber(nectar).comparedTo(new BigNumber(max)) > 0) {
      error = `${strings.tooHigh}${max}`;
    } else if (nectar && nectar.length > 0 && new BigNumber(nectar).comparedTo(new BigNumber('0')) <= 0) {
      error = `${strings.tooLow}`;
    }
    this.setState({nectar: nectar, nectar_error: strings.disabled});
  }
  
  onSelectionChanged(index) {
    this.setState({selected: index});
  }

  addRelayRequest(id) {
    const { addRequest } = this.props;
    if (addRequest) {
      addRequest(strings.relayRequest,id);
    }
  }

  removeRelayRequest(id) {
    const { removeRequest } = this.props;
    if (removeRequest) {
      removeRequest(strings.relayRequest, id);
    }
  }

  transfer(isDeposit) {
    const { state: {nectar, nectar_error}, props: {address} } = this;

    const nectarWei = new BigNumber(nectar).times(new BigNumber('1000000000000000000'));

    const http = this.http;
    if (nectar &&!nectar_error) {
      const uuid = Uuid();
      this.addRelayRequest(uuid);
      let promise;
      if (isDeposit) {
        promise = http.deposit(address, nectarWei.toString());
      } else {
        promise = http.withdraw(address, nectarWei.toString());
      }
      return promise
        .catch(error => this.handleError(error))
        .then(() => {
          this.removeRelayRequest(uuid);
        });
    } else {
      return new Promise((resolve) => resolve());
    }
  }

  handleError(error) {
    return new Promise((resolve) => {
      let errorMessage;
      if (!error || !error.message || error.message.length === 0) {
        errorMessage = strings.error;
      } else {
        errorMessage = error.message;
      }
      this.setState({ error: errorMessage });

      //Update app
      const { props: { onError } } = this;
      if (onError) {
        onError(errorMessage);
      }
      resolve();
    });
  }
}
Relay.proptypes = {
  onTransfer: PropTypes.func,
  address: PropTypes.string,
  wallet: PropTypes.object,
  url: PropTypes.string,
  onBackPressed: PropTypes.func,
  requestsInProgress: PropTypes.array,
  addRequest: PropTypes.func,
  removeRequest: PropTypes.func,
  onRequestWalletChange: PropTypes.func,
  onError: PropTypes.func
};
export default Relay;
// Vendor imports
import React, { Component } from 'react';
import Uuid from 'uuid/v4';
import {CSSTransition} from 'react-transition-group';
import BigNumber from 'bignumber.js';
// Bounty imports
import BountyCreate from '../BountyCreate';
import BountyInfo from '../BountyInfo';
import BountyList from '../BountyList';
import OfferCreate from '../OfferCreate';
import OfferInfo from '../OfferInfo';
import Relay from '../Relay';
import Snackbar from '../Snackbar';
import Welcome from '../Welcome';
// Component imports
import HttpApp from './http';
import config from '../../config';
import strings from './strings';
import ModalPassword from '../ModalPassword';

class App extends Component {
  constructor(props) {
    super(props);
    const {bounties, first} = this.preloadLocalStorage();
    this.http = new HttpApp(config.host, config.websocket_host);
    const wallet = {
      homeEth: 0,
      sideEth: 0,
      homeNct: 0,
      sideNct: 0
    };
    this.cancel = false;
    this.state = {
      key: null,
      address: null,
      wallet,
      active: -1,
      bounties,
      createBounty: false,
      createOffer: false,
      relay: false,
      first,
      errorMessage: null,
      requestsInProgress: [],
      modalOpen: true
    };

    this.onAddBounty = this.onAddBounty.bind(this);
    this.onAddOffer = this.onAddOffer.bind(this);
    this.onAddMessage = this.onAddMessage.bind(this);
    this.onBackPressed = this.onBackPressed.bind(this);
    this.onRemoveBounty = this.onRemoveBounty.bind(this);
    this.onSelectBounty = this.onSelectBounty.bind(this);
    this.onCreateBounty = this.onCreateBounty.bind(this);
    this.onCreateOffer = this.onCreateOffer.bind(this);
    this.onCloseWelcome = this.onCloseWelcome.bind(this);
    this.onKeySelected = this.onKeySelected.bind(this);
    this.onOpenRelay = this.onOpenRelay.bind(this);
    this.onErrorDismissed = this.onErrorDismissed.bind(this);
    this.onPostError = this.onPostError.bind(this);
    this.onRequestWalletChange = this.onRequestWalletChange.bind(this);
    this.addRequest = this.addRequest.bind(this);
    this.removeRequest = this.removeRequest.bind(this);
    this.getData = this.getData.bind(this);
    this.getWallet = this.getWallet.bind(this);
    this.updateOnAssertion = this.updateOnAssertion.bind(this);
    this.onModalRequestClose = this.onModalRequestClose.bind(this);
  }

  componentDidUpdate(_, prevState) {
    const { state: { bounties } } = this;
    const { bounties: prevBounties } = prevState;
    const storageOutOfSync =  JSON.stringify(bounties) !== JSON.stringify(prevBounties);
    if(storageOutOfSync) {
      this.storeBounties(bounties);
    }
  }

  componentDidMount() {
    this.getData();
    this.getWallet();
    this.timer = setInterval(() => {
      const {state: { first }} = this;
      if (!first ) {
        this.getWallet();
      }
    }, 5000);
  }

  componentWillUnmount() {
    this.cancel = true;
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  render() {
    const { state: { active, bounties, createBounty, createOffer, first, 
      errorMessage, relay, modalOpen } } = this;

    return (
      <div className='App'>
        <CSSTransition
          in={first}
          timeout={200}
          mountonEnter
          unmountOnExit
          classNames='fade'>
          {() => (
            <Welcome onClick={this.onCloseWelcome}/>
          )}
        </CSSTransition>
        {!first && (
          <React.Fragment>
            <ModalPassword
              open={modalOpen}
              onModalRequestClose={this.onModalRequestClose}
              onKeySelected={this.onKeySelected}/>
            { createBounty && (
              <BountyCreate
                {...this.getPropsForChild()}
                addBounty={this.onAddBounty}
                onBountyPosted={this.onBackPressed}/>
            )}
            { createOffer && (
              <OfferCreate
                {...this.getPropsForChild()}
                addOffer={this.onAddOffer}
                onOfferCreated={this.onBackPressed}/>
            )}
            { relay && (
              <Relay {...this.getPropsForChild()}/>
            )}
            { !createBounty && !createOffer && !relay && active < 0 && (
              <BountyList
                {...this.getPropsForChild()}
                onBountySelected={this.onSelectBounty}
                onBountyRemoved={this.onRemoveBounty}/>
            )}
            { !createBounty && active >=0 && bounties[active].type === 'bounty' && (
              <BountyInfo
                {...this.getPropsForChild()}
                bounty={bounties[active]}/>
            )}
            { !createOffer && active >=0 && bounties[active].type === 'offer' && (
              <OfferInfo
                {...this.getPropsForChild()}
                // This will just kickoff a refresh of this offer
                onAddMessage={this.onAddMessage}
                offer={bounties[active]}/>
            )}
            {errorMessage && errorMessage.length > 0 && (
              <Snackbar message={errorMessage}
                onDismiss={this.onErrorDismissed}/>
            )}
          </React.Fragment>
        )}
      </div>
    );
  }

  onAddBounty(result) {
    const http = this.http;

    this.addRequest(strings.requestGetBounty, result.guid);
    return http.getBounty('home', result)
      .then(bounty => {
        if (bounty != null) {
          bounty.updated = true;
          const bounties = this.state.bounties.slice();
          bounties.push(bounty);
          this.setState({bounties: bounties});
        }
      })
      .catch(() => {})
      .then(() => {
        this.removeRequest(strings.requestGetBounty, result.guid);
      });
  }

  onAddMessage(guid, message) {
    // deep copy so we it won't edit the actual state
    const bounties = JSON.parse(JSON.stringify(this.state.bounties.slice()));
    const offer = bounties
      .filter((value) => value.type === 'offer')
      .map((offer) => offer.guid === guid);
    if (offer && offer.length == 1) {
      // add message the the front 
      offer.messages.slice(0, 0, message);
      this.setState({bounties: bounties});
    }
  }

  onAddOffer(result) {
    const http = this.http;

    this.addRequest(strings.requestGetOffer, result.guid);
    return http.getOffer('home', result)
      // .then(offer => {
      //   http.listenForMessages(offer, this.onAddMessage);
      //   return offer;
      // })
      .then(offer => {
        if (offer != null) {
          offer.updated = true;
          const bounties = this.state.bounties.slice();
          bounties.push(offer);
          this.setState({bounties: bounties});
        }
      })
      .catch(() => {})
      .then(() => {
        this.removeRequest(strings.requestGetOffer, result.guid);
      });
  }

  onBackPressed() {
    this.setState({
      active: -1,
      createBounty: false,
      createOffer: false,
      relay: false
    });
  }

  onCreateBounty() {
    this.setState({createBounty: true, active: -1});
  }

  onCreateOffer() {
    this.setState({createOffer: true, active: -1});
  }

  onKeySelected(keyfile, address, password) {
    this.setState({address, modalOpen: false});

    this.http.setAccount(address, keyfile, password)
      .then((key) => {
        this.setState({key: key});
        this.http.listenForTransactions(key);
      })
      .then(() => this.getWallet())
      .catch(() => {});
  }

  onModalRequestClose() {
    const {state: {address}} = this;
    if (address) {
      this.setState({modalOpen: false});
    }
  }

  onCloseWelcome() {
    this.setState({first: false});
    this.markSeen();
  }
  
  onErrorDismissed() {
    this.setState({errorMessage: null});
  }
  
  onOpenRelay() {
    this.setState({relay: true, active: -1});
  }

  onPostError(message) {
    this.setState({errorMessage: message});
  }

  onRemoveBounty(index) {
    const bounties = this.state.bounties.slice();
    const { state: {active}} = this;
    if (index !== null && index >= 0 && index < bounties.length) {
      bounties.splice(index, 1);
      let activeValue = active;
      if (active >= bounties.length) {
        activeValue = active - 1;
      }
      this.setState({active: activeValue, bounties: bounties});
    }
  }

  onSelectBounty(index) {
    /*
     * Need a deep copy to edit a specific value on an object in the array
     * without modifying state.
     *
     * FIXME: The stringify stuff is temporary. Will probably change how selected works
     * so that I can do a shallow copy of a different array.
     */
    const bounties = JSON.parse(JSON.stringify(this.state.bounties.slice()));
    if (index !== null && index >= 0 && index < bounties.length) {
      bounties[index].updated = false;
      this.setState({active: index, bounties: bounties});
    }
  }

  onRequestWalletChange() {
    this.setState({modalOpen: true});
  }

  removeRequest(title, id/*, success*/) {
    const requestsInProgress = this.state.requestsInProgress.slice();
    const index = requestsInProgress.findIndex((obj) => obj.id == id);
    if (index >= 0 ) {
      requestsInProgress.splice(index, 1);
      this.setState({requestsInProgress: requestsInProgress});
      // TODO notify users of the success of the request
    }
  }

  addRequest(title, id) {
    const requestsInProgress = this.state.requestsInProgress.slice();
    requestsInProgress.push({title: title, id: id});
    this.setState({requestsInProgress: requestsInProgress});
  }

  updateOnAssertion(assertion) {
    const bounties = this.state.bounties.slice();
    const guid = assertion.guid;
    const index = bounties.findIndex((bounty) => bounty.guid === guid);
    if (index >= 0) {
      const bounty = bounties[index];
      const a = {
        author: assertion.author,
        bid: assertion.bid,
        metadata: assertion.metadata,
        verdicts: assertion.verdicts,
      };
      bounty.assertions.push(a);
      const modified = bounty.artifacts.map((file, index) => {
        const f = file;
        if (!a.verdicts[index]) {
          f.good++;
        }
        f.total++;
        file.assertions.push({
          author: assertion.author,
          bid: assertion.bid,
          verdict: a.verdicts[index],
          metadata: assertion.metadata
        });
        return f;
      });
      bounty.artifacts = modified;
      bounty.update = true;
      bounties[index] = bounty;
    }
    this.setState({bounties: bounties});
  }

  getData() {
    const http = this.http;
    const uuid = Uuid();
    this.addRequest(strings.requestAllData, uuid);
    http.listenForAssertions(this.updateOnAssertion);
    
    const bounties = this.state.bounties.slice();
    const promises = bounties.map((bounty) => {
      const chain = bounty.chain ? bounty.chain : 'home';
      let promise;
      if (bounty.type === 'offer') {
        promise = http.getOffer(chain, bounty)
          .then(offer => {
            http.listenForMessages(offer, this.onAddMessage);
            return offer;
          });
      } else {
        promise = http.getBounty(chain, bounty);
      }
      return promise
        .then(b => {
          if (b == null) {
            return bounty;
          }
          b.updated = bounty.updated;
          if (JSON.stringify(b) !== JSON.stringify(bounty) || bounty.updated) {
            b.updated = true;
          }
          return b;
        });
    });
    return Promise.all(promises).then((values) => {
      // get updated state after download finishes
      const bounties = this.state.bounties.slice();
      values.forEach((value) => {
        const foundIndex = bounties.findIndex((bounty) => bounty.guid === value.guid);
        if (foundIndex >= 0) {
          if (value.type === 'bounty') {
            bounties[foundIndex] = value;
          } else {
            const offer = bounties[foundIndex];
            // Update the fields, but don't wipe it out because messages are separate
            offer.address = value.address;
            offer.closed = value.closed;
            offer.author = value.ambassador;
            offer.expert = value.expert;
          }
        }
      });
      this.setState({bounties: bounties});
      this.removeRequest(strings.requestAllData, uuid);
    });
  }

  getPropsForChild() {
    const {host: url, token} = config;
    const { state: { active, bounties, wallet, requestsInProgress, address, key } } = this;
    return({
      url,
      encryptionKey: key,
      active,
      wallet,
      address,
      bounties,
      token: token,
      requestsInProgress,
      onError: this.onPostError,
      addRequest: this.addRequest,
      onBackPressed: this.onBackPressed,
      onCreateOffer: this.onCreateOffer,
      onOpenRelay: this.onOpenRelay,
      removeRequest: this.removeRequest,
      onCreateBounty: this.onCreateBounty,
      onRequestWalletChange: this.onRequestWalletChange
    });
  }

  getWallet() {
    const http = this.http;
    const chains = ['home'];//, 'side'];
    const eth = chains.map(chain => http.getEth(chain)
      .then(balance =>
        new BigNumber(balance).dividedBy(new BigNumber(1000000000000000000))
      )
      .then((b) => `${b.toNumber()}`)
    );

    const nct = chains.map(chain => http.getNct(chain)
      .then(balance =>
        new BigNumber(balance).dividedBy(new BigNumber(1000000000000000000))
      )
      .then((b) => `${b.toNumber()}`)
    );

    const promises = eth.concat(nct);
    return Promise.all(promises).then(values => {
      return({
        homeEth: values[0],
        sideEth: 0,//values[1],
        homeNct: values[1],//2],
        sideNct: 0//values[3]
      });
    })
      .then((wallet) => new Promise((resolve, reject) => {
        if (this.cancel) {
          reject();
        } else {
          resolve(wallet);
        }
      }))
      .then((wallet) => new Promise(resolve =>
        this.setState({wallet: wallet}, resolve)
      ))
      .catch(() => {});
  }

  storeBounties(bounties) {
    if (this.hasLocalStorage()) {
      localStorage.setItem('bounties', JSON.stringify(bounties));
    }
  }

  hasLocalStorage() {
    try {
      localStorage.setItem('x', 'y');
      localStorage.removeItem('x');
      return true;
    } catch(e) {
      return false;
    }
  }

  markSeen() {
    if (this.hasLocalStorage()) {
      localStorage.setItem('seen', JSON.stringify(true));
    }
  }

  preloadLocalStorage() {
    if (this.hasLocalStorage) {
      const bounties = JSON.parse(localStorage.getItem('bounties')) || [];
      const first = !JSON.parse(localStorage.getItem('seen'));
      return {bounties, first};
    } else {
      return {bounties: [], first: true};
    }
  }
}
export default App;

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
import Snackbar from '../Snackbar';
import Welcome from '../Welcome';
// Component imports
import HttpApp from './http';
import config from '../../config';
import strings from './strings';

class App extends Component {
  constructor(props) {
    super(props);
    const {bounties, first} = this.preloadLocalStorage();
    this.http = new HttpApp(config.host, config.websocket_host);
    this.state = {
      address: 0,
      walletList: [],
      active: -1,
      bounties: bounties,
      createBounty: false,
      createOffer: false,
      first: first,
      errorMessage: null,
      requestsInProgress: []
    };

    this.onAddBounty = this.onAddBounty.bind(this);
    this.onAddOffer = this.onAddOffer.bind(this);
    this.onBackPressed = this.onBackPressed.bind(this);
    this.onRemoveBounty = this.onRemoveBounty.bind(this);
    this.onSelectBounty = this.onSelectBounty.bind(this);
    this.onCreateBounty = this.onCreateBounty.bind(this);
    this.onCreateOffer = this.onCreateOffer.bind(this);
    this.onCloseWelcome = this.onCloseWelcome.bind(this);
    this.onErrorDismissed = this.onErrorDismissed.bind(this);
    this.onPostError = this.onPostError.bind(this);
    this.onWalletChangeHandler = this.onWalletChangeHandler.bind(this);
    this.addRequest = this.addRequest.bind(this);
    this.removeRequest = this.removeRequest.bind(this);
    this.getData = this.getData.bind(this);
    this.getWallets = this.getWallets.bind(this);
    this.updateOnAssertion = this.updateOnAssertion.bind(this);
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
    this.getWallets();
    this.timer = setInterval(() => {
      this.getWallets();
    }, 5000);
  }

  componentWillUnmount() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  render() {

    const { state: { active, bounties, createBounty, createOffer, first, errorMessage } } = this;

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
            { createBounty && (
              <BountyCreate
                {...this.getPropsForChild()}
                onWalletChange={this.onWalletChangeHandler}
                addBounty={this.onAddBounty}
                onBountyPosted={this.onBackPressed}/>
            )}
            { createOffer && (
              <OfferCreate
                {...this.getPropsForChild()}
                onWalletChange={this.onWalletChangeHandler}
                addOffer={this.onAddOffer}
                onBountyPosted={this.onBackPressed}/>
            )}
            { !createBounty && !createOffer && active < 0 && (
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
    return http.getBounty(result)
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

  onAddOffer(result) {

  }

  onBackPressed() {
    this.setState({active: -1, createBounty: false, createOffer: false});
  }

  onCreateBounty() {
    this.setState({createBounty: true, active: -1});
  }

  onCreateOffer() {
    this.setState({createOffer: true, active: -1});
  }

  onCloseWelcome() {
    this.setState({first: false});
    this.markSeen();
  }

  onErrorDismissed() {
    this.setState({errorMessage: null});
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
      this.setState({active: index, create: false, bounties: bounties});
    }
  }

  onWalletChangeHandler(store) {
    this.setState({isUnlocked: store});
    this.getWallets();
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
      return http.getBounty(bounty)
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
          bounties[foundIndex] = value;
        }
      });
      this.setState({bounties: bounties});
      this.removeRequest(strings.requestAllData, uuid);
    });
  }

  getPropsForChild() {
    const {host: url} = config;
    const { state: { active, bounties, walletList, requestsInProgress, address } } = this;
    return({
      url,
      active,
      address,
      bounties,
      walletList,
      requestsInProgress,
      onError: this.onPostError,
      addRequest: this.addRequest,
      removeRequest: this.removeRequest,
      onCreateOffer: this.onCreateOffer,
      onCreateBounty: this.onCreateBounty,
    });
  }

  getWallets() {
    const http = this.http;
    return http.getWallets()
      .then(addresses => addresses.map(address => {
        return({address: address});
      }))
      .then(wallets => {
        const promises = wallets.map((wallet) => {
          const e = http.getEth(wallet.address).then(balance =>
            new BigNumber(balance).dividedBy(new BigNumber(1000000000000000000))
          )
            .then((b) => `${b.toNumber()}`);

          const n = http.getNct(wallet.address).then(balance =>
            new BigNumber(balance).dividedBy(new BigNumber(1000000000000000000))
          )
            .then((b) => `${b.toNumber()}`);

          const promises = [e, n];
          return Promise.all(promises).then(values => {
            return({
              address: wallet.address,
              eth: values[0],
              nct: values[1]
            });
          });
        });
        return Promise.all(promises);
      })
      .then((wallets) => new Promise(resolve =>
        this.setState({walletList: wallets}, resolve)
      ))
      .then(() => http.getUnlockedWallet())
      .then(address => {
        const {state: {walletList}} = this;
        if (!address) {
          this.setState({ address: 0 });
        } else {
          const index = walletList.findIndex((account => account.address === address));
          this.setState({ address: index });
        }
      });
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

// Vendor imports
import React, { Component } from 'react';
import Uuid from 'uuid/v4';
import {CSSTransition} from 'react-transition-group';
// Bounty imports
import BountyCreate from '../BountyCreate';
import BountyInfo from '../BountyInfo';
import BountyList from '../BountyList';
import Card from '../Card';
import Header from '../Header';
import Welcome from '../Welcome';
import Snackbar from '../Snackbar';
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
      isUnlocked: false,
      walletList: [],
      active: -1,
      bounties: bounties,
      create: false,
      first: first,
      errorMessage: null,
      requestsInProgress: []
    };

    this.onAddBounty = this.onAddBounty.bind(this);
    this.onRemoveBounty = this.onRemoveBounty.bind(this);
    this.onSelectBounty = this.onSelectBounty.bind(this);
    this.onCreateBounty = this.onCreateBounty.bind(this);
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
    const {host: url} = config;
    const { state: { active, bounties, create, first, isUnlocked, walletList,
      errorMessage, requestsInProgress } } = this;

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
            <Header title={(bounties.length === 0 || create || active < 0) ? strings.create : bounties[active].guid}
              create={create || bounties.length === 0 || active < 0}
              onClick={this.onCreateBounty}/>
            <div className='App-Content'>
              { (bounties.length === 0 || create ) && (
                <BountyCreate url={url}
                  isUnlocked={isUnlocked}
                  walletList={walletList}
                  onWalletChange={this.onWalletChangeHandler}
                  onError={this.onPostError}
                  addBounty={this.onAddBounty}
                  addRequest={this.addRequest}
                  removeRequest={this.removeRequest}/>
              )}
              { !create && active < 0 && (
                <BountyList bounties={bounties}/>
              )}
              { !create && active >=0 && active < bounties.length && (
                <BountyInfo bounty={bounties[active]}/>
              )}
            </div>
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

  onCreateBounty() {
    this.setState({create: true, active: -1});
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
    if (index !== null && index >= 0 && index < bounties.length) {
      bounties.splice(index, 1);
      this.setState({bounties: bounties});
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

  getWallets() {
    const http = this.http;
    const w = http.getWallets()
      .then(accounts => {
        this.setState({walletList: accounts});
      });

    const u = http.getUnlockedWallet()
      .then((success) => this.setState({isUnlocked: success}));
    const promises = [w, u];
    return Promise.all(promises);
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

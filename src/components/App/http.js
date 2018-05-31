import BigNumber from 'bignumber.js';
import validator from 'validator';
import web3Utils from 'web3-utils';
import multihashes from 'multihashes';
import EthereumTx from 'ethereumjs-tx';
import keythereum from 'keythereum';
import WebSocket from 'isomorphic-ws';

class HttpApp {
  constructor(url, ws) {
    this.url = url;
    this.ws = ws;
  }

  setAccount(address, keyfile, password) {
    if (this.transactions) {
      this.transactions.close();
    }

    // TODO check that file exists
    if (!web3Utils.isAddress(address) ) {
      return false;
    }
    this.address = address;
    this.keyfile = keyfile;
    this.password = password;
    return true;
  }

  getBounty(bounty) {
    return new Promise((resolve, reject) => {
      if (validator.isUUID(bounty.guid, 4)) {
        resolve(bounty.guid);
      } else {
        reject('Invalid GUID');
      }
    })
      .then((guid) => fetch(this.url+'/bounties/'+guid))
      .then(response => {
        if (response.ok) {
          return response;
        } else {
          throw Error('Cannot get bounties.');
        }
      })
      
      .then(response => response.json())
      .then(json => json.result)
      .then(bounty => this.getBountyIsActive(bounty))
      .then(bounty => {
        const amount = new BigNumber(bounty.amount).dividedBy(new BigNumber('1000000000000000000')).toNumber();
        bounty.amount = amount;
        bounty.type = 'bounty';
        return bounty;
      })
      .then(bounty => this.getAssertionsForBounty(bounty))
      .then(bountyAssertions => this.getArtifactsForBounty(bountyAssertions))
      .catch(() => null);
  }

  getOffer(offer) {
    return new Promise((resolve, reject) => {
      if (validator.isUUID(offer.guid, 4)) {
        resolve(offer.guid);
      } else {
        reject('Invalid GUID');
      }
    })
      .then(() => new Promise((resolve) => resolve(offer)))
      .catch(() => null);
  }

  getArtifactsForBounty(bounty) {
    return new Promise((resolve, reject)=> {
      const hash = multihashes.fromB58String(bounty.uri);
      try {
        multihashes.validate(hash);
        resolve(bounty.uri);
      } catch (error) {
        reject(error);
      }
    })
      .then((uri) => fetch(this.url+'/artifacts/'+uri))
      .then(response => {
        if (response.ok) {
          return response;
        } else {
          throw new Error('Unable to access accounts');
        }
      })
      .then(response => response.json())
      .then(json => json.result)
      .then(files => {
        return files.map((file) => {
          return file.name;
        });
      })
      .then(filesnames => {
        return filesnames.map((name) => {
          const trimmed = name.trim();
          return {name: trimmed, good: 0, total: 0, assertions: []};
        });
      })
      .then(files => {
        bounty.artifacts = files;
        return bounty;
      });
  }

  getAssertionsForBounty(bounty) {
    return new Promise((resolve, reject) => {
      if (validator.isUUID(bounty.guid, 4)) {
        resolve(bounty.guid);
      } else {
        reject('Invalid GUID');
      }
    })
      .then(guid => fetch(this.url+'/bounties/'+guid+'/assertions'))
      .then(response => {
        if (response.ok) {
          return response;
        } else {
          throw new Error('Unable to access accounts');
        }
      })
      .then(response => response.json())
      .then(json => json.result)
      .then(assertions => {
        return assertions.map((assertion) => {
          const bid = new BigNumber(assertion.bid).dividedBy(new BigNumber('1000000000000000000')).toNumber();
          return {
            author: assertion.author,
            bid: bid,
            verdicts: assertion.verdicts,
            metadata: assertion.metadata,
          };
        });
      })
      .then(filtered => {
        bounty.assertions = filtered;
        return bounty;
      });
  }

  getBountyIsActive(bounty) {
    return fetch(this.url + '/bounties/active')
      .then(response => {
        if (response.ok) {
          return response;
        } else {
          throw new Error('Unable to access active bounties');
        }
      })
      .then(response => response.json())
      .then(json => json.result)
      .then(bounties => bounties.findIndex(b => b.guid === bounty.guid) >= 0 )
      .then(found => {
        bounty.expired = !found;
        return bounty;
      });
  }

  getEth(chain) {
    const url = this.url;
    const wallet = this.address;
    return new Promise((resolve, reject) => {
      if (web3Utils.isAddress(wallet)) {
        resolve(wallet);
      } else {
        reject(`${wallet} is not an Ethereum address`);
      }
    })
      .then(address => fetch(url+'/balances/'+address+'/eth?chain='+chain))
      .then(response => {
        if (response.ok) {
          return response;
        }
        throw Error('Failed to get balance');
      })
      .then(response => response.json())
      .then(json => json.result+'')
      .catch(() => 0);
  }

  getNct(chain) {
    const url = this.url;
    const wallet = this.address;
    return new Promise((resolve, reject) => {
      if (web3Utils.isAddress(wallet)) {
        resolve(wallet);
      } else {
        reject(`${wallet} is not an Ethereum address`);
      }
    })
      .then(address => fetch(url+'/balances/'+address+'/nct?chain='+chain))
      .then(response => {
        if (response.ok) {
          return response;
        }
        throw Error('Failed to get balance');
      })
      .then(response => response.json())
      .then(json => json.result+'')
      .catch(() => 0);
  }

  listenForTransactions() {
    const ws = this.ws;
    const keyfile = this.keyfile;
    const address = this.address;
    const password = this.password;

    if (!keyfile || !address || !web3Utils.isAddress(address) || !password) {
      return;
    }

    const path = require('path');
    new Promise(resolve => {
      // We double up on the dirname to trim keystore, which importfromfile adds
      const trimmed = path.dirname(path.dirname(keyfile.path));
      const enc_key = keythereum.importFromFile(address, trimmed);
      const key = keythereum.recover(password, enc_key);

      const websocket = new WebSocket(ws+'/transactions');

      websocket.onmessage = (msg) => {
        const {id, data} = JSON.parse(msg.data);
        const {chainId} = data;
        const tx = new EthereumTx(data);
        tx.sign(key);

        websocket.send(JSON.stringify({'id': id, 'chainId': chainId, 'data': tx.serialize().toString('hex')}));
      };
      resolve(websocket);
    })
      .then(websocket => {
        this.transactions = websocket;
      });
  }

  listenForAssertions(assertionAddedCallback) {
    // attach to websocket
    // anytime we get an assertion, check if it matches a guid
    // if it does, add it to the assertions for that object
    const ws = this.ws;
    const websocket = new WebSocket(ws+'/events/home');

    websocket.onmessage = (event) => {
      const message = JSON.parse(event.data);

      if (message.event === 'assertion') {
        const body = message.data;
        const bid = new BigNumber(body.bid).dividedBy(new BigNumber('1000000000000000000')).toNumber();
        const assertion = {
          guid: body.bounty_guid,
          bid: bid,
          verdicts: body.verdicts,
          metadata: body.metadata,
          author: body.author,
        };
        assertionAddedCallback(assertion);
      }
    };
  }
}
export default HttpApp;

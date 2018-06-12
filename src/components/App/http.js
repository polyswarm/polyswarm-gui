import BigNumber from 'bignumber.js';
import validator from 'validator';
import web3Utils from 'web3-utils';
import multihashes from 'multihashes';
import EthereumTx from 'ethereumjs-tx';
import etherutils from 'ethereumjs-util';
import keythereum from 'keythereum';
import WebSocket from 'ws';

class HttpApp {
  constructor(url, ws) {
    this.url = url;
    this.ws = ws;
  }

  setAccount(address, keyfile, password) {
    this.address = address;
    return new Promise((resolve, reject) => {
      require('fs').stat(keyfile.path, err => {
        if (err) {
          reject();
        } else {
          resolve();
        }
      });
    })
      .then(
        () =>
          new Promise((resolve, reject) => {
            if (!web3Utils.isAddress(address)) {
              reject();
            } else {
              resolve();
            }
          })
      )
      .then(
        () =>
          new Promise(resolve => {
            if (this.transactions) {
              this.transactions.close();
            }
            resolve();
          })
      )
      .then(
        () => 
          new Promise((resolve, reject) => {
            const path = require('path');
            if (!keyfile || !address || !web3Utils.isAddress(address) || !password) {
              reject();
            }
            // We double up on the dirname to trim keystore, which importfromfile adds
            const trimmed = path.dirname(path.dirname(keyfile.path));
            const enc_key = keythereum.importFromFile(address, trimmed);
            keythereum.recover(password, enc_key, key => {
              resolve(key);
            });
          })
      );
  }

  getBounty(chain, bounty) {
    const url = this.url;
    return new Promise((resolve, reject) => {
      if (validator.isUUID(bounty.guid, 4)) {
        resolve(bounty.guid);
      } else {
        reject('Invalid GUID');
      }
    })
      .then(guid => fetch(url + '/bounties/' + guid + '?chain=' + chain))
      .then(response => {
        if (response.ok) {
          return response;
        } else {
          throw Error('Cannot get bounties.');
        }
      })

      .then(response => response.json())
      .then(json => json.result)
      .then(bounty => this.getBountyIsActive(chain, bounty))
      .then(bounty => {
        const amount = new BigNumber(bounty.amount)
          .dividedBy(new BigNumber('1000000000000000000'))
          .toNumber();
        bounty.amount = amount;
        bounty.type = 'bounty';
        return bounty;
      })
      .then(bounty => this.getAssertionsForBounty(chain, bounty))
      .then(bountyAssertions => this.getArtifactsForBounty(chain, bountyAssertions))
      .catch(() => null);
  }

  getOffer(chain, offer) {
    const url = this.url;
    const guid = offer.guid;
    return new Promise((resolve, reject) => {
      if (validator.isUUID(guid, 4)) {
        resolve(guid);
      } else {
        reject('Invalid GUID');
      }
    }).then(guid => fetch(url + '/offers/' + guid+ '?chain=' + chain))
      .then(response => {
        if (response.ok) {
          return response;
        }
        return new Promise(resolve => {
          resolve(response.json());
        }).then(json => {
          throw Error(json.message);
        });
      }).then(response => response.json())
      .then(body => body.result)
      .then(result => result.offer_channel)
      .then(offer => {
        offer.guid = guid;
        return offer;
      })
      .then(offer => this.getClosedForOffer(chain, offer))
      .then(offer => {
        offer.type = 'offer';
        return offer;
      })
      .catch(() => null);
  }

  getClosedForOffer(chain, offer) {
    const url = this.url;
    return fetch(url + '/offers/closed' + '?chain=' + chain)
      .then(response => {
        if (response.ok) {
          return response;
        }
        return new Promise(resolve => {
          resolve(response.json());
        }).then(json => {
          throw Error(json.message);
        });
      }).then(response => response.json())
      .then(body => body.result)
      .then(closed => {
        offer.closed = false;
        const index = closed.findIndex((value) => value.guid === offer.guid);
        if ( index >= 0) {
          offer.closed = true;
          offer.address = closed[index].address;
        }
        return offer;
      });
  }

  getArtifactsForBounty(chain, bounty) {
    const url = this.url;
    return new Promise((resolve, reject) => {
      const hash = multihashes.fromB58String(bounty.uri);
      try {
        multihashes.validate(hash);
        resolve(bounty.uri);
      } catch (error) {
        reject(error);
      }
    })
      .then(uri => fetch(url + '/artifacts/' + uri + '?chain=' + chain))
      .then(response => {
        if (response.ok) {
          return response;
        } else {
          throw new Error('Unable to access artifacts');
        }
      })
      .then(response => response.json())
      .then(json => json.result)
      .then(files => {
        return files.map(file => {
          return file.name;
        });
      })
      .then(filesnames => {
        return filesnames.map(name => {
          const trimmed = name.trim();
          return { name: trimmed, assertions: [] };
        });
      })
      .then(files => {
        bounty.artifacts = files;
        return bounty;
      });
  }

  getAssertionsForBounty(chain, bounty) {
    const url = this.url;
    return new Promise((resolve, reject) => {
      if (validator.isUUID(bounty.guid, 4)) {
        resolve(bounty.guid);
      } else {
        reject('Invalid GUID');
      }
    })
      .then(guid => fetch(url + '/bounties/' + guid + '/assertions'+ '?chain=' + chain))
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
        return assertions.map(assertion => {
          const bid = new BigNumber(assertion.bid)
            .dividedBy(new BigNumber('1000000000000000000'))
            .toNumber();
          return {
            author: assertion.author,
            bid: bid,
            verdicts: assertion.verdicts,
            metadata: assertion.metadata
          };
        });
      })
      .then(filtered => {
        bounty.assertions = filtered;
        return bounty;
      });
  }

  getBountyIsActive(chain, bounty) {
    const url = this.url;
    return fetch(url + '/bounties/active'+ '?chain=' + chain)
      .then(response => {
        if (response.ok) {
          return response;
        } else {
          throw new Error('Unable to access active bounties');
        }
      })
      .then(response => response.json())
      .then(json => json.result)
      .then(bounties => bounties.findIndex(b => b.guid === bounty.guid) >= 0)
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
      .then(address =>
        fetch(url + '/balances/' + address + '/eth?chain=' + chain)
      )
      .then(response => {
        if (response.ok) {
          return response;
        }
        throw Error('Failed to get balance');
      })
      .then(response => response.json())
      .then(json => json.result + '')
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
      .then(address =>
        fetch(url + '/balances/' + address + '/nct?chain=' + chain)
      )
      .then(response => {
        if (response.ok) {
          return response;
        }
        throw Error('Failed to get balance');
      })
      .then(response => response.json())
      .then(json => json.result + '')
      .catch(() => 0);
  }

  listenForTransactions(key) {
    const ws = this.ws;
    const websocket = new WebSocket(ws + '/transactions');

    websocket.onmessage = msg => {
      const { id, data } = JSON.parse(msg.data);
      const { chainId } = data;
      const tx = new EthereumTx(data);
      tx.sign(key);

      websocket.send(
        JSON.stringify({
          id: id,
          chainId: chainId,
          data: tx.serialize().toString('hex')
        })
      );
    };
    this.transactions = websocket;
  }

  listenForMessages(offer, onMessageReceived) {
    // [0-31] is close flag
    // [32-63] nonce
    // [64-95] ambassador address
    // [96-127] expert address
    // [128-159] msig address
    // [160-191] balance in nectar for ambassador
    // [192-223] balance in nectar for expert
    // [224-255] token address
    // [256-287] A globally-unique identifier for the Listing.
    // [288-319] The Offer Amount.

    /// @dev Optional State
    // [320-351] Cryptographic hash of the Artifact.
    // [352-383] The IPFS URI of the Artifact.
    // [384-415] Engagement Deadline
    // [416-447] Assertion Deadline
    // [448-479] current commitment
    // [480-511] bitmap of verdicts
    // [512-543] meta data

    // attach to websocket
    // anytime we get a message, we pass it along to the app, which is tracking
    // messages
    const options = {port: Number(offer.port)};
    const expert = offer.expert;
    const websocket = new WebSocket.Server(options);
    websocket.onerror = error => {
      console.error(error);
    };
    websocket.on('connection', (ws) => {
      ws.onmessage = event => {

        const data = JSON.parse(event.data);
        console.info(data);

        const {fromSocketUri: websocket, state, v, r, s} = data;

        let hash = '0x' + etherutils.keccak(etherutils.toBuffer(state)).toString('hex');
        hash = etherutils.hashPersonalMessage(etherutils.toBuffer(hash));

        let address = '0x' + etherutils.pubToAddress(etherutils.ecrecover(hash, v, r, s)).toString('hex');
        address = web3Utils.toChecksumAddress(address);

        if (address !== expert) {
          console.error('Expert does not match signer.');
          return;
        }

        const bufferState = etherutils.toBuffer(state);

        // must be long enough to hold URI, verdicts and metadata.
        if (bufferState.length < 558) {
          return;
        }
        const sequence = bufferState.slice(32, 64).reduce((accumulator, current) => {
          return (accumulator << 32) + current;
        });
        const artifact = String.fromCharCode.apply(String, bufferState.slice(352, 398));
        //14 higher for extra length in URI.
        const verdicts = bufferState.slice(494, 526);

        const metadata = String.fromCharCode.apply(String, bufferState.slice(526, 558));
        metadata.replace('\0','');

        const artifactLength = artifact.split('').filter(letter => letter !== '\0').length > 0;

        if (artifactLength) {
          const url = this.url;
          return new Promise((resolve, reject) => {
            const hash = multihashes.fromB58String(artifact);
            try {
              multihashes.validate(hash);
              resolve(artifact);
            } catch (error) {
              reject(error);
            }
          })
            .then(uri => fetch(url + '/artifacts/' + uri))
            .then(response => {
              if (response.ok) {
                return response;
              } else {
                throw new Error('Unable to access artifacts');
              }
            })
            .then(response => response.json())
            .then(json => json.result)
            .then(files => {
              return {
                type: 'assertion',
                uri: artifact,
                artifacts: files,
                verdicts: [],
                amount: '',
                sequence: sequence,
                guid: offer.guid,
                metadata: metadata
              };
            }).then((message) => {
              let v = verdicts.reduce((accumulator, current) => {
                accumulator.push((current >> 7 & 1) === 1);
                accumulator.push((current >> 6 & 1) === 1);
                accumulator.push((current >> 5 & 1) === 1);
                accumulator.push((current >> 4 & 1) === 1);
                accumulator.push((current >> 3 & 1) === 1);
                accumulator.push((current >> 2 & 1) === 1);
                accumulator.push((current >> 1 & 1) === 1);
                accumulator.push((current & 1) === 1);
                return accumulator;
              }, []);
              if (message.artifacts.length > 0) {
                v = v.slice(256 - message.artifacts.length);
              } else {
                v = [];
              }
              message.verdicts = v;
              return message;
            })
            .then((message) => {
              message.websocket = websocket;
              onMessageReceived(offer.guid, message);
            });
        } else {
          const message = {
            type: 'websocket',
            guid: offer.guid,
            websocket: websocket,
            sequence: sequence,
          };
          onMessageReceived(offer.guid, message);
        }
      };
    });
  }

  listenForAssertions(assertionAddedCallback) {
    // attach to websocket
    // anytime we get an assertion, check if it matches a guid
    // if it does, add it to the assertions for that object
    const ws = this.ws;
    const websocket = new WebSocket(ws + '/events/home');

    websocket.onmessage = event => {
      const message = JSON.parse(event.data);

      if (message.event === 'assertion') {
        const body = message.data;
        const bid = new BigNumber(body.bid)
          .dividedBy(new BigNumber('1000000000000000000'))
          .toNumber();
        const assertion = {
          guid: body.bounty_guid,
          bid: bid,
          verdicts: body.verdicts,
          metadata: body.metadata,
          author: body.author
        };
        assertionAddedCallback(assertion);
      }
    };
  }
}
export default HttpApp;

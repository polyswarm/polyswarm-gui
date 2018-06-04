import web3Utils from 'web3-utils';

class HttpOfferCreate {
  constructor(url) {
    this.url = url;
  }

  getUrlAccount(account) {
    return '?account=' + account;
  }

  createOffer(address, expert, duration, websocket) {
    const url = this.url;
    return new Promise((resolve, reject) => {
      if (web3Utils.isAddress(address)) {
        resolve();
      } else {
        reject(`${address} is not an ethereum address`);
      }
    }).then(() => new Promise((resolve, reject) => {
      if (web3Utils.isAddress(expert)) {
        resolve();
      } else {
        reject(`${expert} is not an ethereum address`);
      }
    })).then(() => new Promise((resolve, reject) => {
      if ( duration && duration  > 10 && websocket ) {
        body = {
          expert: expert,
          ambassador: address,
          // 15 seconds per block min 10
          settlementPeriodLength: (duration * 15),
          websocketUri:  websocket
        };
        resolve(body);
      } else {
        reject();
      }
    })).then(body => fetch(url + '/offers' + this.getUrlAccount(address), {
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'post',
      body: body
    }))
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
      .then(body => body.result);
  }

  openOffer(key, token, offer, balance) {
    new Promise((resolve, reject) => {
      if (validator.isUUID(guid, 4)) {
        resolve(guid);
      } else {
        reject('Invalid GUID');
      }
    }).then(() => new Promise((resolve, reject) => {
      if (web3Utils.isAddress(address)) {
        resolve();
      } else {
        reject();
      }
    })).then(() => new Promise((resolve, reject) => {
      if (balance && balance > 0) {
        const offerState = [];
        offerState.push(0); // is close
        offerState.push(0); // sequence
        offerState.push(offer.ambassador); // ambassador address
        offerState.push(offer.expert); // expert address
        offerState.push(offer.msig); //  msig address
        offerState.push(balance); // new balance in nectar ambassador
        offerState.push(new BigNumber(0)); // balance in nectar expert
        offerState.push(token); // token address
        offerState.push(offer.guid); // A globally-unique identifer for the Listing.
        offerState.push(balance); // The Offer Amount.
        offerState.push(0); // Cryptographic hash of the Artifact.
        offerState.push(0); // The URI of the Artifact.
        offerState.push(0); // Engagement Deadline
        offerState.push(0); // Assertion Deadline
        offerState.push(0); // has the expert made commitment
        offerState.push(0); // “malicious” or “benign”
        offerState.push(0); // Information derived during Assertion generation

        let depositState = marshallState(offerState);

        const sig = secp256k1.sign(depositState, key);
  
        const v = sig.recovery + 27;
        const r = sig.signature.slice(0, 32);
        const s = sig.signature.slice(32, 64);
  
        const body = {
          state,
          v,
          r,
          s
        };
        resolve(body);
      } else {
        reject();
      }
    })).then(body => fetch(url + '/offers/' + guid + '/open' + this.getUrlAccount(address), {
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'post',
      body: body
    }))
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
      .then(body => body.result);
  }
}
export default HttpOfferCreate;

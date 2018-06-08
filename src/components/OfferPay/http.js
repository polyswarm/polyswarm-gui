import validator from 'validator';
import secp256k1 from 'secp256k1';

class HttpOfferPay {
  constructor(url) {
    this.url = url;
  }

  getUrlAccount(account) {
    return '?account=' + account;
  }

  pay(key, offer, amount) {
    const url = this.url;
    return new Promise((resolve, reject) => {
      if (validator.isUUID(offer.guid, 4)) {
        resolve();
      } else {
        reject('Invalid GUID');
      }
    }).then(() => new Promise((resolve, reject) => {
      if (web3Utils.isAddress(offer.author)) {
        resolve();
      } else {
        reject();
      }
    })).then(() =>  new Promise((resolve, reject) => {
      if (offer.initial >= amount) {
        resolve();
      } else {
        reject();
      }
    }))
    .then(() => new Promise((resolve, reject) => {
      if (amount && amount > 0) {
        const offerState = [];
        offerState.push(0); // is close
        offerState.push(0); // sequence
        offerState.push(0); // ambassador address
        offerState.push(0); // expert address
        offerState.push(0); //  msig address
        offerState.push(new BigNumber(offer.initial).minus(amount)); // new balance in nectar ambassador
        offerState.push(amount); // balance in nectar expert
        offerState.push(0); // token address
        offerState.push(0); // A globally-unique identifer for the Listing.
        offerState.push(new BigNumber(offer.initial)); // The Offer Amount.
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
  
          const body = JSON.stringify({
          state: depositState,
          v,
          r,
          s
          });
        resolve(body);
      } else {
        reject('No payment amount specified');
      }
    })).then((body) => {
      const account = this.getUrlAccount(offer.author);
      return fetch(url + '/offers' + offer.guid + '/sendmsg' + account, {
        headers: {
          'Content-Type': 'application/json'
        },
        method: 'post',
        body: body
      });
    }).then(response => {
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

  marshallState(inputs) {
    var m = this.getBytes(inputs[0]);

    for(var i=1; i<inputs.length;i++) {
      m += this.getBytes(inputs[i]).substr(2, this.getBytes(inputs[i]).length);
    }
    return m;
  }
}
export default HttpOfferPay;

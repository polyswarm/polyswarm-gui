import web3Utils from 'web3-utils';
import validator from 'validator';
import etherutils from 'ethereumjs-util';

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
    })
      .then(
        () =>
          new Promise((resolve, reject) => {
            if (web3Utils.isAddress(expert)) {
              resolve();
            } else {
              reject(`${expert} is not an ethereum address`);
            }
          })
      )
      .then(
        () =>
          new Promise((resolve, reject) => {
            if (duration && duration > 10 && websocket) {
              const body = JSON.stringify({
                expert: expert,
                ambassador: address,
                settlementPeriodLength: Number(duration),
                websocketUri: websocket
              });
              resolve(body);
            } else {
              reject();
            }
          })
      )
      .then(body =>
        fetch(url + '/offers' + this.getUrlAccount(address), {
          headers: {
            'Content-Type': 'application/json'
          },
          method: 'post',
          body: body
        })
      )
      .then(response => {
        if (response.ok) {
          return response;
        }
        return new Promise(resolve => {
          resolve(response.json());
        }).then(json => {
          throw Error(json.message);
        });
      })
      .then(response => response.json())
      .then(body => body.result);
  }

  openOffer(key, offer, balance) {
    const url = this.url;
    new Promise((resolve, reject) => {
      if (validator.isUUID(offer.guid, 4)) {
        resolve();
      } else {
        reject('Invalid GUID');
      }
    })
      .then(
        () =>
          new Promise((resolve, reject) => {
            if (web3Utils.isAddress(offer.ambassador)) {
              resolve();
            } else {
              reject();
            }
          })
      )
      .then(
        () =>
          new Promise((resolve, reject) => {
            if (balance && balance > 0) {
              const offerState = [];
              offerState.push(0); // is close
              offerState.push(0); // sequence
              offerState.push(offer.ambassador); // ambassador address
              offerState.push(offer.expert); // expert address
              offerState.push(offer.msig); //  msig address
              offerState.push(balance); // new balance in nectar ambassador
              offerState.push(0); // balance in nectar expert
              offerState.push(0); // token address
              offerState.push(offer.guid); // A globally-unique identifer for the Listing.
              offerState.push(balance); // The Offer Amount.
              offerState.push(0); // Cryptographic hash of the Artifact.
              offerState.push(0); // The URI of the Artifact.
              offerState.push(0); // Engagement Deadline
              offerState.push(0); // Assertion Deadline
              offerState.push(0); // has the expert made commitment
              offerState.push(0); // “malicious” or “benign”
              offerState.push(0); // Information derived during Assertion generation

              const depositState = this.marshallState(offerState);
              const buff_key = etherutils.toBuffer(key);
              const state = web3Utils.toHex(depositState);
              let msg =
                '0x' +
                etherutils.keccak(etherutils.toBuffer(state)).toString('hex');
              msg =
                '0x' +
                etherutils
                  .hashPersonalMessage(etherutils.toBuffer(msg))
                  .toString('hex');
              const sig = etherutils.ecsign(etherutils.toBuffer(msg), buff_key);
              let r = '0x' + sig.r.toString('hex');
              let s = '0x' + sig.s.toString('hex');
              let v = sig.v;

              const body = JSON.stringify({
                state,
                v,
                r,
                s
              });
              resolve(body);
            } else {
              reject();
            }
          })
      )
      .then(body =>
        fetch(
          url +
            '/offers/' +
            offer.guid +
            '/open' +
            this.getUrlAccount(offer.ambassador),
          {
            headers: {
              'Content-Type': 'application/json'
            },
            method: 'post',
            body: body
          }
        )
      )
      .then(response => {
        if (response.ok) {
          return response;
        }
        return new Promise(resolve => {
          resolve(response.json());
        }).then(json => {
          throw Error(json.message);
        });
      })
      .then(response => response.json())
      .then(body => body.result);
  }

  marshallState(inputs) {
    var m = this.getBytes(inputs[0]);

    for (var i = 1; i < inputs.length; i++) {
      m += this.getBytes(inputs[i]).substr(2, this.getBytes(inputs[i]).length);
    }
    return m;
  }

  getBytes(input) {
    if (Buffer.isBuffer(input)) input = '0x' + input.toString('hex');
    if (66 - input.length <= 0) return web3Utils.toHex(input);
    return this.padBytes32(web3Utils.toHex(input));
  }

  padBytes32(data) {
    // TODO: check input is hex / move to TS
    let l = 66 - data.length;

    let x = data.substr(2, data.length);

    for (var i = 0; i < l; i++) {
      x = 0 + x;
    }
    return '0x' + x;
  }
}
export default HttpOfferCreate;

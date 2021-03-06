import validator from 'validator';
import etherutils from 'ethereumjs-util';
import web3Utils from 'web3-utils';
import BigNumber from 'bignumber.js';

class HttpOfferPay {
  constructor(url) {
    this.url = url;
  }

  getUrlAccount(account) {
    return '?account=' + account;
  }

  pay(key, offer, sequence, amount) {
    const url = this.url;
    const initialWel = web3Utils.toWei(offer.initial);
    return new Promise((resolve, reject) => {
      if (validator.isUUID(offer.guid, 4)) {
        resolve();
      } else {
        reject('Invalid GUID');
      }
    })
      .then(
        () =>
          new Promise((resolve, reject) => {
            if (
              new BigNumber(initialWel).comparedTo(new BigNumber(amount)) >= 0
            ) {
              resolve();
            } else {
              reject('Reward bigger than channel value.');
            }
          })
      )
      .then(
        () =>
          new Promise((resolve, reject) => {
            if (amount && amount > 0) {
              const offerState = [];
              offerState.push(1); // is close
              offerState.push(sequence); // sequence
              offerState.push(0); // ambassador address
              offerState.push(0); // expert address
              offerState.push(0); //  msig address
              offerState.push(
                new BigNumber(initialWel).minus(new BigNumber(amount))
              ); // new balance in nectar ambassador
              offerState.push(amount); // balance in nectar expert
              offerState.push(0); // token address
              offerState.push(0); // A globally-unique identifer for the Listing.
              offerState.push(new BigNumber(initialWel)); // The Offer Amount.
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
                toSocketUri: offer.expertWebsocketUri,
                fromSocketUri: offer.ambassadorWebsocketUri,
                state,
                v,
                r,
                s
              });
              resolve(body);
            } else {
              reject('No payment amount specified');
            }
          })
      )
      .then(body => {
        const account = this.getUrlAccount(offer.ambassador);
        return fetch(url + '/offers/' + offer.guid + '/sendmsg' + account, {
          headers: {
            'Content-Type': 'application/json'
          },
          method: 'post',
          body: body
        });
      })
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
export default HttpOfferPay;

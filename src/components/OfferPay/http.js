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
    const initialWei = web3Utils.toWei(offer.initial);
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
              new BigNumber(initialWei).comparedTo(new BigNumber(amount)) >= 0
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
            if ( amount && amount > 0 ) {
              resolve();
            } else {
              reject('Amount must be above 0.');
            }
          }))
      .then(
        () => {
          const body = JSON.stringify({
            close_flag: 1,
            nonce: sequence,
            ambassador: offer.ambassador,
            expert: offer.expert,
            msig_address: offer.msig_address,
            ambassador_balance: new BigNumber(initialWei).minus(new BigNumber(amount)).toNumber(),
            expert_balance: new BigNumber(amount).toNumber(),
            guid: offer.guid,
            offer_amount: new BigNumber(initialWei).toNumber()
          });
          const account = this.getUrlAccount(offer.ambassador);
          return fetch(url + '/offers/state' + account, {
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
      .then(json => json.result.state)
      .then(state => {
        const buff_key = etherutils.toBuffer(key);
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

        return JSON.stringify({
          to_socket: offer.expertWebsocketUri,
          from_socket: offer.ambassadorWebsocketUri,
          state,
          v,
          r,
          s
        });
      })
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
}
export default HttpOfferPay;

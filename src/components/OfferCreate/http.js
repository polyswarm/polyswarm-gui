import web3Utils from 'web3-utils';
import validator from 'validator';
import etherutils from 'ethereumjs-util';
import BigNumber from 'bignumber.js';

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
            if ( balance && balance > 0 ) {
              resolve();
            } else {
              reject('Balance must be above 0.');
            }
          }))
      .then(
        () => {
          const body = JSON.stringify({
            close_flag: 0,
            nonce: 0,
            ambassador: offer.ambassador,
            expert: offer.expert,
            msig_address: offer.msig,
            ambassador_balance: new BigNumber(balance).toNumber(),
            expert_balance: 0,
            guid: offer.guid,
            offer_amount: new BigNumber(balance).toNumber()
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
          state,
          v,
          r,
          s
        });
      })
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
}
export default HttpOfferCreate;

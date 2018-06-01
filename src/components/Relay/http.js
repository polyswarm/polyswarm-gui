import web3Utils from 'web3-utils';

class HttpRelay {
  constructor(url) {
    this.url = url;
  }

  getUrlAccount(account) {
    return '?account=' + account;
  }

  withdraw(address, amount) {
    const url = this.url + '/relay/withdrawal'+ this.getUrlAccount(address);
    return this.transfer(url, address, amount);
  }

  deposit(address, amount) {
    const url = this.url + '//relay/deposit'+ this.getUrlAccount(address);
    return this.transfer(url, address, amount);
  }

  transfer(url, address, amount) {
    return new Promise((resolve, reject) => {
      if (amount) {
        const body = JSON.stringify({
          amount: amount,
        });
        resolve(body);
      } else {
        reject('Invalid amount.');
      }
    })
      .then(body => {
        if (web3Utils.isAddress(address)) {
          return fetch(url, {
            headers: {
              'Content-Type': 'application/json'
            },
            method: 'post',
            body: body
          });
        } else {
          return new Promise((resolve, reject) => {
            reject(address+' is not a valid Ethereum address.');
          });
        }
      })
      .then(response => {
        if (response.ok) {
          return response;
        }
        return new Promise(resolve => {
          resolve(response.json());
        })
          .then(json => {
            throw Error(json.message);
          });
      })
      .then(response => response.json())
      .then(body => body.result);
  }
}
export default HttpRelay;
import web3Utils from 'web3-utils';

class HttpAccount {
  constructor(url) {
    this.url = url;
  }

  unlockWallet(wallet, password) {
    const url = this.url;
    return new Promise((resolve, reject) => {
      if (web3Utils.isAddress(wallet)) {
        resolve(wallet);
      } else {
        reject(`${wallet} is not an ethereum address`);
      }
    })
      .then(address => fetch(url+'/accounts/'+address+'/unlock', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({'password': password})
      }))
      .then(response => response.ok)
      .catch(() => false);
  }

  createWallet(password) {
    const url = this.url;
    return fetch(url + '/accounts', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({'password': password})
    })
      .then(response => response.ok)
      .catch(() => false);
  }
}
export default HttpAccount;

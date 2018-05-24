class HttpAccount {
  constructor(url) {
    this.url = url;
  }

  unlockWallet(address, password) {
    const url = this.url;
    return fetch(url+'/accounts/'+address+'/unlock', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({'password': password})
    })
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

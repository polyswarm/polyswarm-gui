class HttpRelay {
  constructor(url) {
    this.url = url;
  }

  withdraw(amount) {
    return new Promise(resolve => resolve());
  }

  deposit(amount) {
    return new Promise(resolve => resolve());
  }
}
export default HttpRelay;
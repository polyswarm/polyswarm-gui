class HttpOffer {
  constructor(url) {
    this.url = url;
  }

  unlockWallet() {
    return new Promise((resolve) => {
      resolve(true);
    });
  }

  pay() {
    return new Promise((resolve) => {
      resolve();
    });
  }
}
export default HttpOffer;
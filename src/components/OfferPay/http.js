class HttpOfferPay {
  constructor(url) {
    this.url = url;
  }

  pay(guid, amount) {
    return new Promise(resolve => resolve());
  }
}
export default HttpOfferPay;
import validator from 'validator';

class HttpOfferPay {
  constructor(url) {
    this.url = url;
  }

  pay(guid, amount) {
    return new Promise((resolve, reject) => {
      if (validator.isUUID(guid, 4)) {
        resolve(guid);
      } else {
        reject('Invalid GUID');
      }
    })
      .then((valid) => new Promise(resolve => resolve()));
  }
}
export default HttpOfferPay;
import web3Utils from 'web3-utils';

class HttpOfferCreate {
  constructor(url) {
    this.url = url;
  }

  createOffer(expert, reward, duration) {
    return new Promise((resolve, reject) => {
      if (web3Utils.isAddress(wallet)) {
        resolve(wallet);
      } else {
        reject(`${wallet} is not an ethereum address`);
      }
    })
      .then(() => new Promise((resolve) => {
        resolve(true);
      }));
  }
}
export default HttpOfferCreate;
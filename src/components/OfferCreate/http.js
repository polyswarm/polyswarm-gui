class HttpOfferCreate {
  constructor(url) {
    this.url = url;
  }

  createOffer(expert, reward, duration) {
    return new Promise((resolve) => {
      resolve(true);
    });
  }
}
export default HttpOfferCreate;
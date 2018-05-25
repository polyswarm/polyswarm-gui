class HttpOfferManage {
  constructor(url) {
    this.url = url;
  }

  pay(amount) {
    return new Promise((resolve) => {
      resolve(true);
    });
  }

  request(files)  {
    return new Promise((resolve) => {
      resolve(true);
    });
  }
}
export default HttpOfferManage;
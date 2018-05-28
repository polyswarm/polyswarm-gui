import multihashes from 'multihashes';

class HttpRequest {
  constructor(url) {
    this.url = url;
  }
  
  uploadFiles() {
    return new Promise(resolve => resolve());
  }

  sendRequest(artifactUri) {
    return new Promise((resolve, reject)=> {
      const hash = multihashes.fromB58String(artifactUri);
      try {
        multihashes.validate(hash);
        resolve(artifactUri);
      } catch (error) {
        reject(error);
      }
    })
      .then((uri) => new Promise(resolve => resolve()));
  }
}
export default HttpRequest;
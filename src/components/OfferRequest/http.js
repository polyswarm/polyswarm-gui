import multihashes from 'multihashes';
import secp256k1 from 'secp256k1';
import Http from '../BountyCreate/http';

class HttpRequest {
  constructor(url) {
    this.url = url;
  }

  getUrlAccount(account) {
    return '?account=' + account;
  }

  uploadFiles(files) {
    const url = this.url;
    const helper = new Http(url);
    return helper.uploadFiles(files);
  }

  sendRequest(guid, key, address, artifactUri) {
    const url = this.url;
    return new Promise((resolve, reject) => {
      const hash = multihashes.fromB58String(artifactUri);
      try {
        multihashes.validate(hash);
        resolve(artifactUri);
      } catch (error) {
        reject(error);
      }
    }).then(() => new Promise((resolve, reject) => {
      if (validator.isUUID(guid, 4)) {
        resolve(guid);
      } else {
        reject('Invalid GUID');
      }
    })).then(() => new Promise((resolve, reject) => {
      if (web3Utils.isAddress(address)) {
        resolve();
      } else {
        reject();
      }
    })).then(() => new Promise(resolve => {
      const offerState = [];
      offerState.push(0); // is close
      offerState.push(0); // sequence
      offerState.push(0); // ambassador address
      offerState.push(0); // expert address
      offerState.push(0); //  msig address
      offerState.push(0); // new balance in nectar ambassador
      offerState.push(0); // balance in nectar expert
      offerState.push(0); // token address
      offerState.push(0); // A globally-unique identifer for the Listing.
      offerState.push(0); // The Offer Amount.
      offerState.push(0); // Cryptographic hash of the Artifact.
      offerState.push(artifactUri); // The URI of the Artifact.
      offerState.push(0); // Engagement Deadline
      offerState.push(0); // Assertion Deadline
      offerState.push(0); // has the expert made commitment
      offerState.push(0); // “malicious” or “benign”
      offerState.push(0); // Information derived during Assertion generation

      let depositState = marshallState(offerState);

      const sig = secp256k1.sign(depositState, key);

      const v = sig.recovery + 27;
      const r = sig.signature.slice(0, 32);
      const s = sig.signature.slice(32, 64);

      const body = {
        state,
        v,
        r,
        s
      };
      resolve(body);
    })).then((body) => {
      const account = this.getUrlAccount(address);
      return fetch(url + '/offers' + guid + '/sendmsg' + account, {
        headers: {
          'Content-Type': 'application/json'
        },
        method: 'post',
        body: body
      });
    }).then(response => {
      if (response.ok) {
        return response;
      }
      return new Promise(resolve => {
        resolve(response.json());
      }).then(json => {
        throw Error(json.message);
      });
    }).then(response => response.json())
      .then(body => body.result);
  }

  getArtifactsList(uri) {
    const url = this.url;
    return new Promise((resolve, reject) => {
      const hash = multihashes.fromB58String(uri);
      try {
        multihashes.validate(hash);
        resolve(uri);
      } catch (error) {
        reject(error);
      }
    })
      .then(uri => fetch(url + '/artifacts/' + uri))
      .then(response => {
        if (response.ok) {
          return response;
        } else {
          throw new Error('Unable to access accounts');
        }
      })
      .then(response => response.json())
      .then(json => json.result)
      .then(files => {
        return files.map(file => {
          file.name = file.name.trim();
          return file;
        });
      });
  }
}
export default HttpRequest;

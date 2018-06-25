import multihashes from 'multihashes';
import validator from 'validator';
import etherutils from 'ethereumjs-util';
import web3Utils from 'web3-utils';
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

  sendRequest(key, offer, sequence, artifactUri) {
    const url = this.url;
    return new Promise((resolve, reject) => {
      const hash = multihashes.fromB58String(artifactUri);
      try {
        multihashes.validate(hash);
        resolve(artifactUri);
      } catch (error) {
        reject(error);
      }
    })
      .then(
        () =>
          new Promise((resolve, reject) => {
            if (validator.isUUID(offer.guid, 4)) {
              resolve();
            } else {
              reject('Invalid GUID');
            }
          })
      )
      .then(
        () =>
          new Promise((resolve, reject) => {
            if (web3Utils.isAddress(offer.ambassador)) {
              resolve();
            } else {
              reject();
            }
          })
      )
      .then(() => {
        const body = JSON.stringify({
          close_flag: 0,
          nonce: sequence,
          ambassador: offer.ambassador,
          expert: offer.expert,
          msig_address: offer.msig_address,
          ambassador_balance: 0,
          expert_balance: 0,
          guid: offer.guid,
          offer_amount: 0,
          ipfs_hash: artifactUri
        });
        const account = this.getUrlAccount(offer.ambassador);
        return fetch(url + '/offers/state' + account, {
          headers: {
            'Content-Type': 'application/json'
          },
          method: 'post',
          body: body
        });
      })
      .then(response => {
        if (response.ok) {
          return response;
        }
        return new Promise(resolve => {
          resolve(response.json());
        }).then(json => {
          throw Error(json.message);
        });
      })
      .then(response => response.json())
      .then(json => json.result.state)
      .then(state => {
        const buff_key = etherutils.toBuffer(key);
        let msg =
          '0x' + etherutils.keccak(etherutils.toBuffer(state)).toString('hex');

        msg =
          '0x' +
          etherutils
            .hashPersonalMessage(etherutils.toBuffer(msg))
            .toString('hex');

        const sig = etherutils.ecsign(etherutils.toBuffer(msg), buff_key);
        let r = '0x' + sig.r.toString('hex');
        let s = '0x' + sig.s.toString('hex');
        let v = sig.v;

        return JSON.stringify({
          to_socket: offer.expertWebsocketUri,
          from_socket: offer.ambassadorWebsocketUri,
          state,
          v,
          r,
          s
        });
      })
      .then(body => {
        const account = this.getUrlAccount(offer.ambassador);
        return fetch(url + '/offers/' + offer.guid + '/sendmsg' + account, {
          headers: {
            'Content-Type': 'application/json'
          },
          method: 'post',
          body: body
        });
      })
      .then(response => {
        if (response.ok) {
          return response;
        }
        return new Promise(resolve => {
          resolve(response.json());
        }).then(json => {
          throw Error(json.message);
        });
      })
      .then(response => response.json())
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

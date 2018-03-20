class HttpApp {
  constructor(url) {
    this.url = url;
  }

  getUnlockedWallet() {
    return fetch(this.url+'/accounts/active')
      .then(response => {
        if (response.ok) {
          return response;
        } else {
          throw new Error('Unable to access accounts');
        }
      })
      .then(response => response.json())
      .then(json => json.unlocked);
  }

  getWallets() {
    return fetch(this.url+'/accounts')
      .then(response => {
        if (response.ok) {
          return response;
        } else {
          throw new Error('Unable to access accounts');
        }
      })
      .then(response => response.json())
      .then(json => json.accounts);
  }

  getBounty(bounty) {
    fetch(this.url+'/bounties/'+bounty.guid)
      .then(response => {
        if (response.ok) {
          return response;
        } else {
          throw new Error('Unable to access accounts');
        }
      })
      .then(response => response.json())
      .then(json => json.bounty)
      .then(bounty => getAssertionsForBounty(bounty))
      .then(bountyAssertions => getArtifactsForBounty(bountyAssertions))
      .then(bounty => {
        const assertions = bounty.assertions;
        let files = bounty.artifacts;
        files.sort();
        assertions.forEach((assertion) => {
          asseertion.verdicts.forEach((verdict, index) => {
            const file = files[index];
            if (!verdict) {
              file.good++;
            }
            file.total++;
            file.assertions.push(assertion);
            files[index] = file;
          });
        });
        bounty.artifacts = files;
      });
  }

  getArtifactsForBounty(bounty) {
    fetch(this.url+'/artifacts/'+bounty.uri)
      .then(response => {
        if (response.ok) {
          return response;
        } else {
          throw new Error('Unable to access accounts');
        }
      })
      .then(response => response.json())
      .then(json => json.links)
      .then(links => {
        // I don't know how this works, tbh.
        return links.map((link) => {
          return {name: link};
        });
      })
      .then(filenames => {
        bounty.artifacts = filenames;
        return bounty;
      });
  }

  getAssertionsForBounty(bounty) {
    fetch(this.url+'/bounties/'+bounty.guid+'/assertions')
      .then(response => {
        if (response.ok) {
          return response;
        } else {
          throw new Error('Unable to access accounts');
        }
      })
      .then(response => response.json())
      .then(assertions => {
        return assertions.map((assertion) => {
          const a = {};
          a[assertion.author] = {
            bid: assertion.bid,
            verdicts: assertion.verdicts,
            metadata: assertion.metadata,
          };
          return a;
        });
      })
      .then(filtered => {
        bounty.assertions = filtered;
        return bounty;
      });
  }

  listenForAssertions(bountyListCallback, assertionAddedCallback) {
    // attach to websocket
    // anytime we get an assertion, check if it matchs a guid
    // if it does, add it to the assertions for that object

  }
}
export default HttpApp;

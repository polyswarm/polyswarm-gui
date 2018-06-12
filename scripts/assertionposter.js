const etherutils = require('ethereumjs-util');
const web3Utils = require('web3-utils');
const BigNumber = require('bignumber.js');
const WebSocket = require('ws');
const ip = require('ip');
const keythereum = require('keythereum');

const marshallState = (inputs) => {
  var m = getBytes(inputs[0]);

  for(var i=1; i<inputs.length;i++) {
    m += getBytes(inputs[i]).substr(2, getBytes(inputs[i]).length);
  }
  return m;
};

const getBytes = (input) => {
  if(Buffer.isBuffer(input)) input = '0x' + input.toString('hex');
  if(66-input.length <= 0) return web3Utils.toHex(input);
  return padBytes32(web3Utils.toHex(input));
};

const padBytes32 = (data) => {
  // TODO: check input is hex / move to TS
  let l = 66-data.length;

  let x = data.substr(2, data.length);

  for(var i=0; i<l; i++) {
    x = 0 + x;
  }
  return '0x' + x;
};

const wss = new WebSocket.Server({ port: 9090 });

wss.on('connection', function connection(ws) {
  ws.onmessage = msg => {
    const {state, v, r, s} = JSON.parse(msg.data);

    let hash = '0x' + etherutils.keccak(etherutils.toBuffer(state)).toString('hex');
    hash = etherutils.hashPersonalMessage(etherutils.toBuffer(hash));

    const address = '0x' + etherutils.pubToAddress(etherutils.ecrecover(hash, v, r, s)).toString('hex');
    console.info(address);
  };
});

const ws = new WebSocket('ws://localhost:8989');

ws.onopen = () => {
  const enc_key = keythereum.importFromFile('0x18AA9b01E74981004f190E1066BaC5fD78222b28',
    '/home/user/.ethereum/priv_testnet');
  const key = keythereum.recover('password', enc_key);/*, key => {
    resolve(key);
  });*/

  const offerState = [];
  offerState.push(1); // is close
  offerState.push(1); // sequence
  offerState.push(0); // ambassador address
  offerState.push(0); // expert address
  offerState.push(0); //  msig address
  offerState.push(0); // new balance in nectar ambassador
  offerState.push(0); // balance in nectar expert
  offerState.push(0); // token address
  offerState.push(0); // A globally-unique identifer for the Listing.
  offerState.push(0); // The Offer Amount.
  offerState.push(0); // Cryptographic hash of the Artifact.
  offerState.push('QmTrRcSSqwwCi6wLKNxmy5xdw4utMCCgQMJozKfE1Kiz5X'); // The URI of the Artifact.
  offerState.push(0); // Engagement Deadline
  offerState.push(0); // Assertion Deadline
  offerState.push(0); // has the expert made commitment
  offerState.push(1); // “malicious” or “benign”
  offerState.push('This is a baaaad file.'); // Information derived during Assertion generation

  const depositState = marshallState(offerState);
  const buff_key = etherutils.toBuffer(key);
  const state = web3Utils.toHex(depositState);
  let msg = '0x' + etherutils.keccak(etherutils.toBuffer(state)).toString('hex');
  msg = '0x' + etherutils.hashPersonalMessage(etherutils.toBuffer(msg)).toString('hex');
  const sig = etherutils.ecsign(etherutils.toBuffer(msg), buff_key);
  let r = '0x' + sig.r.toString('hex');
  let s = '0x' + sig.s.toString('hex');
  let v = sig.v;

  const body = JSON.stringify({
    toSocketUri: `ws://${ip.address()}:8989`,
    fromSocketUri: `ws://${ip.address()}:9090`,
    state,
    v,
    r,
    s
  });
  ws.send(body);
};

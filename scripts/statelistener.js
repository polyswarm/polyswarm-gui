const etherutils = require('ethereumjs-util');
const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8989 });

wss.on('connection', function connection(ws) {
  ws.onmessage = msg => {
    const {state, v, r, s} = JSON.parse(msg.data);

    let hash = '0x' + etherutils.keccak(etherutils.toBuffer(state)).toString('hex');
    hash = etherutils.hashPersonalMessage(etherutils.toBuffer(hash));

    const address = '0x' + etherutils.pubToAddress(etherutils.ecrecover(hash, v, r, s)).toString('hex');
    console.info(address);
  };
});

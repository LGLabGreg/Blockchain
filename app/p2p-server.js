const Websocket = require('ws');

const P2P_PORT = process.env.P2P_PORT || 5001;
const peers = process.env.PEERS ? process.env.PEERS.split(',') : [];
const MESSAGES_TYPES = {
  chain: 'CHAIN',
  transaction: 'TRANSACTION'
};

class P2PServer {
  constructor(blockchain, transactionPool) {
    this.blockchain = blockchain;
    this.transactionPool = transactionPool;
    this.sockets = [];
  }

  listen() {
    const server = new Websocket.Server({
      port: P2P_PORT
    });
    server.on('connection', socket => this.connectSocket(socket));

    this.connectToPeers();

    console.log(`Listenning for peer-to-peer connections on: ${P2P_PORT}`);
  }

  connectToPeers() {
    // peer address should look like ws://localhost:5001
    peers.forEach(peer => {
      const socket = new Websocket(peer);
      socket.on('open', () => this.connectSocket(socket));
    });
  }

  connectSocket(socket) {
    this.sockets.push(socket);
    console.log('Socket connected');

    this.messageHandler(socket);
    this.sendChain(socket);
  }

  messageHandler(socket) {
    socket.on('message', message => {
      const data = JSON.parse(message);
      switch (data.type) {
        case MESSAGES_TYPES.chain:
          this.blockchain.replaceChain(data.chain);
          break;
        case MESSAGES_TYPES.transaction:
          this.transactionPool.updateOrAddTransaction(data.transaction);
          break;
      }
    });
  }

  sendChain(socket) {
    socket.send(JSON.stringify({ type: MESSAGES_TYPES.chain, chain: this.blockchain.chain }));
  }

  sendTransaction(socket, transaction) {
    socket.send(JSON.stringify({ type: MESSAGES_TYPES.transaction, transaction }));
  }

  syncChains() {
    this.sockets.forEach(socket => this.sendChain(socket));
  }

  broadcastTransaction(transaction) {
    this.sockets.forEach(socket => this.sendTransaction(socket, transaction));
  }
}

module.exports = P2PServer;

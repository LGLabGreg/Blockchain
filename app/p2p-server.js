const Websocket = require('ws');

const P2P_PORT = process.env.P2P_PORT || 5001;
const peers = process.env.PEERS ? process.env.PEERS.split(',') : [];

class P2PServer {
  constructor(blockchain) {
    this.blockchain = blockchain;
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
  }
}

module.exports = P2PServer;

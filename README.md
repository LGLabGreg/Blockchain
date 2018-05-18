# Blockchain

### Dev
npm run dev

### Production
npm start

### Run
First instance:
$ npm run dev

Second instance:
$ cross-env HTTP_PORT=3002 P2P_PORT=5002 PEERS=ws://localhost:5001 npm run dev

Get peer public key:
GET http://localhost:3002/publicKey -> 'publicKey'

Create transactions:
POST http://localhost:3001/transact
{
  "recipient": publicKey,
  "amount": 50
}

Mine transactions:
GET http://localhost:3001/mine-transactions

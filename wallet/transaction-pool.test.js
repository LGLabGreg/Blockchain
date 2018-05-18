const TransactionPool = require('./transaction-pool');
const Transaction = require('./transaction');
const Wallet = require('./index');
const Blockchain = require('../blockchain');

describe('TransactionPool', () => {
  let pool, wallet, transaction, bc;

  beforeEach(() => {
    pool = new TransactionPool();
    wallet = new Wallet();
    bc = new Blockchain();
    transaction = wallet.createTransaction('r4nd-4ddr355', 30, bc, pool);
  });

  it('adds a transaction to the pool', () => {
    expect(pool.transactions.find(t => t.id === transaction.id)).toEqual(transaction);
  });

  it('updates a transaction in the pool', () => {
    const oldTransaction = JSON.stringify(transaction);
    const newTransaction = transaction.update(wallet, 'foo-4ddr355', 40);
    pool.updateOrAddTransaction(newTransaction);
    expect(JSON.stringify(pool.transactions.find(t => t.id === newTransaction.id))).not.toEqual(
      oldTransaction
    );
  });

  it('clears transactions', () => {
    pool.clear();
    expect(pool.transactions).toEqual([]);
  });

  describe('mixing valid and corrupt transactions', () => {
    let validTransactions;

    beforeEach(() => {
      validTransactions = [...pool.transactions];
      for (let i = 0; i < 6; i++) {
        wallet = new Wallet();
        transaction = wallet.createTransaction('r4nd-4ddr355', 30, bc, pool);
        if (i % 2 == 0) {
          transaction.input.amount = 99999;
        } else {
          validTransactions.push(transaction);
        }
      }
    });
    it('shows a difference between valid and corrupt transactions', () => {
      expect(JSON.stringify(pool.transactions)).not.toEqual(JSON.stringify(validTransactions));
    });

    it('grabs valid transactions', () => {
      expect(pool.validTransactions()).toEqual(validTransactions);
    });
  });
});

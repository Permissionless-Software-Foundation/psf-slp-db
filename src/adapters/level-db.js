/*
  Adapter library for LevelDB.
*/

// Public npm libraries.
import { Level } from 'level'

// Hack to get __dirname back.
// https://blog.logrocket.com/alternatives-dirname-node-js-es-modules/
import * as url from 'url'
const __dirname = url.fileURLToPath(new URL('.', import.meta.url))

class LevelDb {
  constructor (localConfig = {}) {
    // Encapsulate dependencies
    // this.level = level
  }

  openDbs () {
    // Instantiate LevelDB databases
    console.log('Opening LevelDB databases...')

    // Address database. Tracks the balances of addresses.
    this.addrDb = new Level(`${__dirname.toString()}/../../leveldb/current/addrs`, {
      valueEncoding: 'json',
      cacheSize: 1 * 1024 * 1024 * 1024 // 1 GB
    })

    // Transaction database. Acts as a cache, to reduce the amount of network
    // calls and computation.
    this.txDb = new Level(`${__dirname.toString()}/../../leveldb/current/txs`, {
      valueEncoding: 'json',
      cacheSize: 1 * 1024 * 1024 * 1024 // 1 GB
    })

    // Token Stats database.
    this.tokenDb = new Level(
      `${__dirname.toString()}/../../leveldb/current/tokens`,
      {
        valueEncoding: 'json'
      }
    )

    // Tracks the sync status of the indexer.
    this.statusDb = new Level(
      `${__dirname.toString()}/../../leveldb/current/status`,
      {
        valueEncoding: 'json'
      }
    )

    // Processed transaction database. Used to detect transactions that have
    // already been processed.
    this.pTxDb = new Level(`${__dirname.toString()}/../../leveldb/current/ptxs`, {
      valueEncoding: 'json'
    })

    // The UTXO database is used as a sort of reverse-lookup. The key is the TXID
    // plus vout, in this format: 'txid:vout'.
    // and the value is the vout and address. This can be used to lookup what
    // address possesses the UTXO. This makes handling of 'controlled burn' txs
    // much faster.
    this.utxoDb = new Level(`${__dirname.toString()}/../../leveldb/current/utxos`, {
      valueEncoding: 'json'
    })

    // Pin Claims are on-chain payments for pinning IPFS content.
    this.pinClaimDb = new Level(`${__dirname.toString()}/../../leveldb/current/pinClaim`, {
      valueEncoding: 'json'
    })

    return {
      addrDb: this.addrDb,
      txDb: this.txDb,
      tokenDb: this.tokenDb,
      statusDb: this.statusDb,
      pTxDb: this.pTxDb,
      utxoDb: this.utxoDb,
      pinClaimDb: this.pinClaimDb
    }
  }

  // Cleanly close the open databases.
  async closeDbs () {
    await this.addrDb.close()
    await this.txDb.close()
    await this.tokenDb.close()
    await this.statusDb.close()
    await this.pTxDb.close()
    await this.utxoDb.close()
    await this.pinClaimDb.close()

    // Signal that the databases were close successfully.
    return true
  }
}

// module.exports = LevelDb
export default LevelDb

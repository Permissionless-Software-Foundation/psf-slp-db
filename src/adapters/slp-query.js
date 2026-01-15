/*
  A library for querying the LevelDB entries.
*/

class SlpQuery {
  constructor (localConfig = {}) {
    const { addrDb, tokenDb, txDb, statusDb } = localConfig
    this.addrDb = addrDb
    this.tokenDb = tokenDb
    this.txDb = txDb
    this.statusDb = statusDb

    if (!this.addrDb) throw new Error('addrDb missing when instantiating SlpQuery library')
    if (!this.tokenDb) throw new Error('tokenDb missing when instantiating SlpQuery library')
    if (!this.txDb) throw new Error('txDb missing when instantiating SlpQuery library')
    if (!this.statusDb) throw new Error('statusDb missing when instantiating SlpQuery library')
  }

  // Query the state of an address from the database.
  async getAddress (addr) {
    try {
      if (!addr) throw new Error('Address required when calling getAddress()')

      const result = await this.addrDb.get(addr)

      return result
    } catch (err) {
      console.log('Error in getAddress()')
      throw err
    }
  }

  async getTx (txid) {
    try {
      if (!txid) throw new Error('txid required when calling getTx()')

      const result = await this.txDb.get(txid)

      return result
    } catch (err) {
      console.log('Error in getTx(): ', err)
      throw err
    }
  }

  async getToken (tokenId) {
    try {
      if (!tokenId) throw new Error('tokenId required when calling getToken()')

      const result = await this.tokenDb.get(tokenId)

      return result
    } catch (err) {
      console.log('Error in getToken()')
      throw err
    }
  }

  async getStatus () {
    try {
      const result = await this.statusDb.get('status')

      return result
    } catch (err) {
      console.log('Error in getStatus()')
      throw err
    }
  }
}

// module.exports = SlpQuery
export default SlpQuery

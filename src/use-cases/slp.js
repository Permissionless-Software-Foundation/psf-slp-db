/*
  Use Case library for SLP operations. This library contains business logic
  for querying SLP token data, addresses, transactions, and indexer status.
*/

class SlpUseCases {
  constructor (localConfig = {}) {
    this.adapters = localConfig.adapters
    if (!this.adapters) {
      throw new Error(
        'Instance of adapters must be passed in when instantiating SLP Use Cases library.'
      )
    }

    // Encapsulate dependencies
    // Note: slpQuery is created lazily in adapters.start(), so we access it via this.adapters.slpQuery
    // when methods are called, rather than storing it in the constructor.
    this.blacklist = this.adapters.blacklist

    if (!this.blacklist) {
      throw new Error(
        'blacklist adapter must be passed in when instantiating SLP Use Cases library.'
      )
    }
  }

  // Lazy getter for slpQuery to ensure it's available when methods are called
  get slpQuery () {
    if (!this.adapters.slpQuery) {
      throw new Error(
        'slpQuery adapter is not available. Ensure adapters.start() has been called.'
      )
    }
    return this.adapters.slpQuery
  }

  // Get address balance and SLP token information
  async getAddress (address) {
    try {
      if (!address) {
        throw new Error('Address required when calling getAddress()')
      }

      const result = await this.slpQuery.getAddress(address)

      return result
    } catch (err) {
      console.error('Error in slp.js/getAddress()')
      throw err
    }
  }

  // Get transaction data hydrated with token information
  async getTx (txid) {
    try {
      if (!txid) {
        throw new Error('txid required when calling getTx()')
      }

      const result = await this.slpQuery.getTx(txid)

      return result
    } catch (err) {
      console.error('Error in slp.js/getTx()')
      throw err
    }
  }

  // Get token statistics
  async getToken (tokenId, withTxHistory = false) {
    try {
      if (!tokenId) {
        throw new Error('tokenId required when calling getToken()')
      }

      // Check if token is in the blacklist
      const isInBlacklist = this.blacklist.checkBlacklist(tokenId)
      if (isInBlacklist) {
        // Return a minimal response for blacklisted tokens
        return {
          tokenId,
          name: 'not-available'
        }
      }

      const result = await this.slpQuery.getToken(tokenId)

      // Delete the tx history if the user does not explicitly want it. This
      // significantly reduces the size of the payload going across the internet.
      if (!withTxHistory && result.txs) {
        delete result.txs
      }

      return result
    } catch (err) {
      console.error('Error in slp.js/getToken()')
      throw err
    }
  }

  // Get indexer sync status
  async getStatus () {
    try {
      const result = await this.slpQuery.getStatus()

      return result
    } catch (err) {
      console.error('Error in slp.js/getStatus()')
      throw err
    }
  }
}

export default SlpUseCases

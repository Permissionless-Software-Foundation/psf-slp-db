/*
  REST API Controller library for the /level route
*/

// Global npm libraries

// Local libraries
import wlogger from '../../../adapters/wlogger.js'

class LevelRESTControllerLib {
  constructor (localConfig = {}) {
    // Dependency Injection.
    this.adapters = localConfig.adapters
    if (!this.adapters) {
      throw new Error(
        'Instance of Adapters library required when instantiating /ipfs REST Controller.'
      )
    }
    this.useCases = localConfig.useCases
    if (!this.useCases) {
      throw new Error(
        'Instance of Use Cases library required when instantiating /ipfs REST Controller.'
      )
    }

    // Encapsulate dependencies
    // this.UserModel = this.adapters.localdb.Users
    // this.userUseCases = this.useCases.user

    // Bind 'this' object to all subfunctions
    this.handleError = this.handleError.bind(this)
    this.getAddr = this.getAddr.bind(this)
    this.createAddr = this.createAddr.bind(this)
    this.updateAddr = this.updateAddr.bind(this)
    this.deleteAddr = this.deleteAddr.bind(this)
    this.getTx = this.getTx.bind(this)
    this.createTx = this.createTx.bind(this)
    this.updateTx = this.updateTx.bind(this)
    this.deleteTx = this.deleteTx.bind(this)
    this.getToken = this.getToken.bind(this)
    this.createToken = this.createToken.bind(this)
    this.updateToken = this.updateToken.bind(this)
    this.deleteToken = this.deleteToken.bind(this)
    this.getStatus = this.getStatus.bind(this)
    this.createStatus = this.createStatus.bind(this)
    this.updateStatus = this.updateStatus.bind(this)
    this.deleteStatus = this.deleteStatus.bind(this)
    this.getPTx = this.getPTx.bind(this)
    this.createPTx = this.createPTx.bind(this)
    this.updatePTx = this.updatePTx.bind(this)
    this.deletePTx = this.deletePTx.bind(this)
    this.getUtxo = this.getUtxo.bind(this)
    this.createUtxo = this.createUtxo.bind(this)
    this.updateUtxo = this.updateUtxo.bind(this)
    this.deleteUtxo = this.deleteUtxo.bind(this)
    this.getPinClaim = this.getPinClaim.bind(this)
    this.createPinClaim = this.createPinClaim.bind(this)
    this.updatePinClaim = this.updatePinClaim.bind(this)
    this.deletePinClaim = this.deletePinClaim.bind(this)
    this.backup = this.backup.bind(this)
    this.restore = this.restore.bind(this)
  }

  // DRY error handler
  handleError (ctx, err) {
    // If an HTTP status is specified by the buisiness logic, use that.
    if (err.status) {
      if (err.message) {
        ctx.throw(err.status, err.message)
      } else {
        ctx.throw(err.status)
      }
    } else {
      // By default use a 422 error if the HTTP status is not specified.
      ctx.throw(422, err.message)
    }
  }

  /**
   * @api {get} /level/addr/:addr Get info on an address from LevelDB
   * @apiPermission public
   * @apiName GetLevelAddr
   * @apiGroup REST Level
   *
   * @apiExample Example usage:
   * curl -H "Content-Type: application/json" -X GET localhost:5001/level/addr
   *
   */
  async getAddr (ctx) {
    try {
      const addr = ctx.params

      const result = await this.adapters.level.addrDb.get(addr)

      ctx.body = result
    } catch (err) {
      wlogger.error('Error in ipfs/controller.js/getStatus(): ')
      // ctx.throw(422, err.message)
      this.handleError(ctx, err)
    }
  }

  /**
   * @api {post} /level/addr Create a new address entry
   * @apiPermission public
   * @apiName CreateLevelAddr
   * @apiGroup REST Level
   *
   * @apiExample Example usage:
   * curl -H "Content-Type: application/json" -X POST -d '{ "user": { "email": "email@format.com", "name": "my name", "password": "secretpasas" } }' localhost:5010/users
   *
   */
  async createAddr (ctx) {
    try {
      const { addr, addrData } = ctx.request.body

      await this.adapters.level.addrDb.put(addr, addrData)

      ctx.body = {
        addr,
        success: true
      }
    } catch (err) {
      this.handleError(ctx, err)
    }
  }

  /**
   * @api {put} /level/addr/:addr Update an address
   * @apiPermission public
   * @apiName UpdateLevelAddr
   * @apiGroup REST Level
   *
   * @apiExample Example usage:
   * curl -H "Content-Type: application/json" -X PUT -d '{ "user": { "name": "Cool new Name" } }' localhost:5000/users/56bd1da600a526986cf65c80
   *
   */
  async updateAddr (ctx) {
    try {
      const { addr, addrData } = ctx.request.body

      await this.adapters.level.addrDb.put(addr, addrData)

      ctx.body = {
        addr,
        success: true
      }
    } catch (err) {
      this.handleError(ctx, err)
    }
  }

  /**
   * @api {delete} /level/addr/:addr Delete an address
   * @apiPermission public
   * @apiName UpdateLevelAddr
   * @apiGroup REST Level
   *
   * @apiExample Example usage:
   * curl -H "Content-Type: application/json" -X DELETE localhost:5000/users/56bd1da600a526986cf65c80
   *
   */
  async deleteAddr (ctx) {
    try {
      const addr = ctx.body.addr

      await this.adapters.level.addrDb.del(addr)

      ctx.body = {
        addr,
        success: true
      }
    } catch (err) {
      this.handleError(ctx, err)
    }
  }

  /**
   * @api {get} /level/tx/:txid Get transaction data from LevelDB
   * @apiPermission public
   * @apiName GetLevelTx
   * @apiGroup REST Level
   *
   * @apiParam {String} txid Transaction ID to retrieve
   *
   * @apiExample Example usage:
   * curl -H "Content-Type: application/json" -X GET localhost:5001/level/tx/1234567890abcdef
   *
   * @apiSuccess {Object} Transaction data from LevelDB
   */
  async getTx (ctx) {
    try {
      const { txid } = ctx.params

      const result = await this.adapters.level.txDb.get(txid)

      ctx.body = result
    } catch (err) {
      wlogger.error('Error in level/controller.js/getTx(): ', err)
      this.handleError(ctx, err)
    }
  }

  /**
   * @api {post} /level/tx Create a new transaction entry in LevelDB
   * @apiPermission public
   * @apiName CreateLevelTx
   * @apiGroup REST Level
   *
   * @apiParam {String} txid Transaction ID
   * @apiParam {Object} txData Transaction data to store
   *
   * @apiExample Example usage:
   * curl -H "Content-Type: application/json" -X POST -d '{ "txid": "1234567890abcdef", "txData": { "inputs": [], "outputs": [] } }' localhost:5001/level/tx
   *
   * @apiSuccess {String} txid Transaction ID
   * @apiSuccess {Boolean} success Success status
   */
  async createTx (ctx) {
    try {
      const { txid, txData } = ctx.request.body

      await this.adapters.level.txDb.put(txid, txData)

      ctx.body = {
        txid,
        success: true
      }
    } catch (err) {
      wlogger.error('Error in level/controller.js/createTx(): ', err)
      this.handleError(ctx, err)
    }
  }

  /**
   * @api {put} /level/tx/:txid Update an existing transaction in LevelDB
   * @apiPermission public
   * @apiName UpdateLevelTx
   * @apiGroup REST Level
   *
   * @apiParam {String} txid Transaction ID to update
   * @apiParam {Object} txData Updated transaction data
   *
   * @apiExample Example usage:
   * curl -H "Content-Type: application/json" -X PUT -d '{ "txData": { "inputs": [], "outputs": [], "timestamp": 1234567890 } }' localhost:5001/level/tx/1234567890abcdef
   *
   * @apiSuccess {String} txid Transaction ID
   * @apiSuccess {Boolean} success Success status
   */
  async updateTx (ctx) {
    try {
      const { txid } = ctx.params
      const { txData } = ctx.request.body

      await this.adapters.level.txDb.put(txid, txData)

      ctx.body = {
        txid,
        success: true
      }
    } catch (err) {
      wlogger.error('Error in level/controller.js/updateTx(): ', err)
      this.handleError(ctx, err)
    }
  }

  /**
   * @api {delete} /level/tx/:txid Delete a transaction from LevelDB
   * @apiPermission public
   * @apiName DeleteLevelTx
   * @apiGroup REST Level
   *
   * @apiParam {String} txid Transaction ID to delete
   *
   * @apiExample Example usage:
   * curl -H "Content-Type: application/json" -X DELETE localhost:5001/level/tx/1234567890abcdef
   *
   * @apiSuccess {String} txid Transaction ID
   * @apiSuccess {Boolean} success Success status
   */
  async deleteTx (ctx) {
    try {
      const { txid } = ctx.params

      await this.adapters.level.txDb.del(txid)

      ctx.body = {
        txid,
        success: true
      }
    } catch (err) {
      wlogger.error('Error in level/controller.js/deleteTx(): ', err)
      this.handleError(ctx, err)
    }
  }

  /**
   * @api {get} /level/token/:tokenId Get token stats data from LevelDB
   * @apiPermission public
   * @apiName GetLevelToken
   * @apiGroup REST Level
   *
   * @apiParam {String} tokenId Token ID to retrieve
   *
   * @apiExample Example usage:
   * curl -H "Content-Type: application/json" -X GET localhost:5001/level/token/1234567890abcdef
   *
   * @apiSuccess {Object} Token stats data from LevelDB
   */
  async getToken (ctx) {
    try {
      const { tokenId } = ctx.params

      const result = await this.adapters.level.tokenDb.get(tokenId)

      ctx.body = result
    } catch (err) {
      wlogger.error('Error in level/controller.js/getToken(): ', err)
      this.handleError(ctx, err)
    }
  }

  /**
   * @api {post} /level/token Create a new token stats entry in LevelDB
   * @apiPermission public
   * @apiName CreateLevelToken
   * @apiGroup REST Level
   *
   * @apiParam {String} tokenId Token ID
   * @apiParam {Object} tokenData Token stats data to store
   *
   * @apiExample Example usage:
   * curl -H "Content-Type: application/json" -X POST -d '{ "tokenId": "1234567890abcdef", "tokenData": { "name": "MyToken", "symbol": "MTK", "decimals": 8 } }' localhost:5001/level/token
   *
   * @apiSuccess {String} tokenId Token ID
   * @apiSuccess {Boolean} success Success status
   */
  async createToken (ctx) {
    try {
      const { tokenId, tokenData } = ctx.request.body

      await this.adapters.level.tokenDb.put(tokenId, tokenData)

      ctx.body = {
        tokenId,
        success: true
      }
    } catch (err) {
      wlogger.error('Error in level/controller.js/createToken(): ', err)
      this.handleError(ctx, err)
    }
  }

  /**
   * @api {put} /level/token/:tokenId Update an existing token stats in LevelDB
   * @apiPermission public
   * @apiName UpdateLevelToken
   * @apiGroup REST Level
   *
   * @apiParam {String} tokenId Token ID to update
   * @apiParam {Object} tokenData Updated token stats data
   *
   * @apiExample Example usage:
   * curl -H "Content-Type: application/json" -X PUT -d '{ "tokenData": { "name": "UpdatedToken", "symbol": "UTK", "decimals": 8, "totalSupply": 1000000 } }' localhost:5001/level/token/1234567890abcdef
   *
   * @apiSuccess {String} tokenId Token ID
   * @apiSuccess {Boolean} success Success status
   */
  async updateToken (ctx) {
    try {
      const { tokenId } = ctx.params
      const { tokenData } = ctx.request.body

      await this.adapters.level.tokenDb.put(tokenId, tokenData)

      ctx.body = {
        tokenId,
        success: true
      }
    } catch (err) {
      wlogger.error('Error in level/controller.js/updateToken(): ', err)
      this.handleError(ctx, err)
    }
  }

  /**
   * @api {delete} /level/token/:tokenId Delete a token stats entry from LevelDB
   * @apiPermission public
   * @apiName DeleteLevelToken
   * @apiGroup REST Level
   *
   * @apiParam {String} tokenId Token ID to delete
   *
   * @apiExample Example usage:
   * curl -H "Content-Type: application/json" -X DELETE localhost:5001/level/token/1234567890abcdef
   *
   * @apiSuccess {String} tokenId Token ID
   * @apiSuccess {Boolean} success Success status
   */
  async deleteToken (ctx) {
    try {
      const { tokenId } = ctx.params

      await this.adapters.level.tokenDb.del(tokenId)

      ctx.body = {
        tokenId,
        success: true
      }
    } catch (err) {
      wlogger.error('Error in level/controller.js/deleteToken(): ', err)
      this.handleError(ctx, err)
    }
  }

  /**
   * @api {get} /level/status/:statusKey Get indexer sync status from LevelDB
   * @apiPermission public
   * @apiName GetLevelStatus
   * @apiGroup REST Level
   *
   * @apiParam {String} statusKey Status key to retrieve (e.g., 'lastBlockHeight', 'syncProgress')
   *
   * @apiExample Example usage:
   * curl -H "Content-Type: application/json" -X GET localhost:5001/level/status/lastBlockHeight
   *
   * @apiSuccess {Object} Indexer sync status data from LevelDB
   */
  async getStatus (ctx) {
    try {
      const { statusKey } = ctx.params

      const result = await this.adapters.level.statusDb.get(statusKey)

      ctx.body = result
    } catch (err) {
      wlogger.error('Error in level/controller.js/getStatus(): ', err)
      this.handleError(ctx, err)
    }
  }

  /**
   * @api {post} /level/status Create a new status entry in LevelDB
   * @apiPermission public
   * @apiName CreateLevelStatus
   * @apiGroup REST Level
   *
   * @apiParam {String} statusKey Status key (e.g., 'lastBlockHeight', 'syncProgress')
   * @apiParam {Object} statusData Status data to store
   *
   * @apiExample Example usage:
   * curl -H "Content-Type: application/json" -X POST -d '{ "statusKey": "lastBlockHeight", "statusData": { "height": 800000, "timestamp": 1234567890 } }' localhost:5001/level/status
   *
   * @apiSuccess {String} statusKey Status key
   * @apiSuccess {Boolean} success Success status
   */
  async createStatus (ctx) {
    try {
      const { statusKey, statusData } = ctx.request.body

      await this.adapters.level.statusDb.put(statusKey, statusData)

      ctx.body = {
        statusKey,
        success: true
      }
    } catch (err) {
      wlogger.error('Error in level/controller.js/createStatus(): ', err)
      this.handleError(ctx, err)
    }
  }

  /**
   * @api {put} /level/status Update the indexer status in LevelDB
   * @apiPermission public
   * @apiName UpdateLevelStatus
   * @apiGroup REST Level
   *
   * @apiParam {Object} statusData Status data containing startBlockHeight, syncedBlockHeight, and chainTipHeight
   *
   * @apiExample Example usage:
   * curl -H "Content-Type: application/json" -X PUT -d '{ "statusData": { "startBlockHeight": 543376, "syncedBlockHeight": 800001, "chainTipHeight": 800002 } }' localhost:5001/level/status
   *
   * @apiSuccess {String} statusKey Status key (always "status")
   * @apiSuccess {Boolean} success Success status
   */
  async updateStatus (ctx) {
    try {
      // const { statusKey } = ctx.params
      const statusKey = 'status'
      const { statusData } = ctx.request.body

      await this.adapters.level.statusDb.put(statusKey, statusData)

      ctx.body = {
        statusKey,
        success: true
      }
    } catch (err) {
      wlogger.error('Error in level/controller.js/updateStatus(): ', err)
      this.handleError(ctx, err)
    }
  }

  /**
   * @api {delete} /level/status/:statusKey Delete a status entry from LevelDB
   * @apiPermission public
   * @apiName DeleteLevelStatus
   * @apiGroup REST Level
   *
   * @apiParam {String} statusKey Status key to delete
   *
   * @apiExample Example usage:
   * curl -H "Content-Type: application/json" -X DELETE localhost:5001/level/status/lastBlockHeight
   *
   * @apiSuccess {String} statusKey Status key
   * @apiSuccess {Boolean} success Success status
   */
  async deleteStatus (ctx) {
    try {
      const { statusKey } = ctx.params

      await this.adapters.level.statusDb.del(statusKey)

      ctx.body = {
        statusKey,
        success: true
      }
    } catch (err) {
      wlogger.error('Error in level/controller.js/deleteStatus(): ', err)
      this.handleError(ctx, err)
    }
  }

  /**
   * @api {get} /level/ptx/:ptxKey Get processed transaction data from LevelDB
   * @apiPermission public
   * @apiName GetLevelPTx
   * @apiGroup REST Level
   *
   * @apiParam {String} ptxKey Processed transaction key to retrieve
   *
   * @apiExample Example usage:
   * curl -H "Content-Type: application/json" -X GET localhost:5001/level/ptx/1234567890abcdef
   *
   * @apiSuccess {Object} Processed transaction data from LevelDB
   */
  async getPTx (ctx) {
    try {
      const { ptxKey } = ctx.params

      const result = await this.adapters.level.pTxDb.get(ptxKey)

      ctx.body = result
    } catch (err) {
      wlogger.error('Error in level/controller.js/getPTx(): ', err)
      this.handleError(ctx, err)
    }
  }

  /**
   * @api {post} /level/ptx Create a new processed transaction entry in LevelDB
   * @apiPermission public
   * @apiName CreateLevelPTx
   * @apiGroup REST Level
   *
   * @apiParam {String} ptxKey Processed transaction key
   * @apiParam {Object} ptxData Processed transaction data to store
   *
   * @apiExample Example usage:
   * curl -H "Content-Type: application/json" -X POST -d '{ "ptxKey": "1234567890abcdef", "ptxData": { "txid": "1234567890abcdef", "processedAt": 1234567890, "status": "completed" } }' localhost:5001/level/ptx
   *
   * @apiSuccess {String} ptxKey Processed transaction key
   * @apiSuccess {Boolean} success Success status
   */
  async createPTx (ctx) {
    try {
      const { ptxKey, ptxData } = ctx.request.body

      await this.adapters.level.pTxDb.put(ptxKey, ptxData)

      ctx.body = {
        ptxKey,
        success: true
      }
    } catch (err) {
      wlogger.error('Error in level/controller.js/createPTx(): ', err)
      this.handleError(ctx, err)
    }
  }

  /**
   * @api {put} /level/ptx/:ptxKey Update an existing processed transaction in LevelDB
   * @apiPermission public
   * @apiName UpdateLevelPTx
   * @apiGroup REST Level
   *
   * @apiParam {String} ptxKey Processed transaction key to update
   * @apiParam {Object} ptxData Updated processed transaction data
   *
   * @apiExample Example usage:
   * curl -H "Content-Type: application/json" -X PUT -d '{ "ptxData": { "txid": "1234567890abcdef", "processedAt": 1234567891, "status": "completed", "blocksProcessed": 100 } }' localhost:5001/level/ptx/1234567890abcdef
   *
   * @apiSuccess {String} ptxKey Processed transaction key
   * @apiSuccess {Boolean} success Success status
   */
  async updatePTx (ctx) {
    try {
      const { ptxKey } = ctx.params
      const { ptxData } = ctx.request.body

      await this.adapters.level.pTxDb.put(ptxKey, ptxData)

      ctx.body = {
        ptxKey,
        success: true
      }
    } catch (err) {
      wlogger.error('Error in level/controller.js/updatePTx(): ', err)
      this.handleError(ctx, err)
    }
  }

  /**
   * @api {delete} /level/ptx/:ptxKey Delete a processed transaction from LevelDB
   * @apiPermission public
   * @apiName DeleteLevelPTx
   * @apiGroup REST Level
   *
   * @apiParam {String} ptxKey Processed transaction key to delete
   *
   * @apiExample Example usage:
   * curl -H "Content-Type: application/json" -X DELETE localhost:5001/level/ptx/1234567890abcdef
   *
   * @apiSuccess {String} ptxKey Processed transaction key
   * @apiSuccess {Boolean} success Success status
   */
  async deletePTx (ctx) {
    try {
      const { ptxKey } = ctx.params

      await this.adapters.level.pTxDb.del(ptxKey)

      ctx.body = {
        ptxKey,
        success: true
      }
    } catch (err) {
      wlogger.error('Error in level/controller.js/deletePTx(): ', err)
      this.handleError(ctx, err)
    }
  }

  /**
   * @api {get} /level/utxo/:utxoKey Get UTXO data from LevelDB
   * @apiPermission public
   * @apiName GetLevelUtxo
   * @apiGroup REST Level
   *
   * @apiParam {String} utxoKey UTXO key in format 'txid:vout'
   *
   * @apiExample Example usage:
   * curl -H "Content-Type: application/json" -X GET localhost:5001/level/utxo/1234567890abcdef:0
   *
   * @apiSuccess {Object} UTXO data from LevelDB
   */
  async getUtxo (ctx) {
    try {
      const { utxoKey } = ctx.params

      const result = await this.adapters.level.utxoDb.get(utxoKey)

      ctx.body = result
    } catch (err) {
      wlogger.error('Error in level/controller.js/getUtxo(): ', err)
      this.handleError(ctx, err)
    }
  }

  /**
   * @api {post} /level/utxo Create a new UTXO entry in LevelDB
   * @apiPermission public
   * @apiName CreateLevelUtxo
   * @apiGroup REST Level
   *
   * @apiParam {String} utxoKey UTXO key in format 'txid:vout'
   * @apiParam {Object} utxoData UTXO data to store
   *
   * @apiExample Example usage:
   * curl -H "Content-Type: application/json" -X POST -d '{ "utxoKey": "1234567890abcdef:0", "utxoData": { "vout": 0, "address": "bitcoincash:qpm2qsznhks23z7629mms6s4cwef74vcwvy22gdx6a", "value": 100000 } }' localhost:5001/level/utxo
   *
   * @apiSuccess {String} utxoKey UTXO key
   * @apiSuccess {Boolean} success Success status
   */
  async createUtxo (ctx) {
    try {
      const { utxoKey, utxoData } = ctx.request.body

      await this.adapters.level.utxoDb.put(utxoKey, utxoData)

      ctx.body = {
        utxoKey,
        success: true
      }
    } catch (err) {
      wlogger.error('Error in level/controller.js/createUtxo(): ', err)
      this.handleError(ctx, err)
    }
  }

  /**
   * @api {put} /level/utxo/:utxoKey Update an existing UTXO in LevelDB
   * @apiPermission public
   * @apiName UpdateLevelUtxo
   * @apiGroup REST Level
   *
   * @apiParam {String} utxoKey UTXO key to update
   * @apiParam {Object} utxoData Updated UTXO data
   *
   * @apiExample Example usage:
   * curl -H "Content-Type: application/json" -X PUT -d '{ "utxoData": { "vout": 0, "address": "bitcoincash:qpm2qsznhks23z7629mms6s4cwef74vcwvy22gdx6a", "value": 150000, "spent": false } }' localhost:5001/level/utxo/1234567890abcdef:0
   *
   * @apiSuccess {String} utxoKey UTXO key
   * @apiSuccess {Boolean} success Success status
   */
  async updateUtxo (ctx) {
    try {
      const { utxoKey } = ctx.params
      const { utxoData } = ctx.request.body

      await this.adapters.level.utxoDb.put(utxoKey, utxoData)

      ctx.body = {
        utxoKey,
        success: true
      }
    } catch (err) {
      wlogger.error('Error in level/controller.js/updateUtxo(): ', err)
      this.handleError(ctx, err)
    }
  }

  /**
   * @api {delete} /level/utxo/:utxoKey Delete a UTXO from LevelDB
   * @apiPermission public
   * @apiName DeleteLevelUtxo
   * @apiGroup REST Level
   *
   * @apiParam {String} utxoKey UTXO key to delete
   *
   * @apiExample Example usage:
   * curl -H "Content-Type: application/json" -X DELETE localhost:5001/level/utxo/1234567890abcdef:0
   *
   * @apiSuccess {String} utxoKey UTXO key
   * @apiSuccess {Boolean} success Success status
   */
  async deleteUtxo (ctx) {
    try {
      const { utxoKey } = ctx.params

      await this.adapters.level.utxoDb.del(utxoKey)

      ctx.body = {
        utxoKey,
        success: true
      }
    } catch (err) {
      wlogger.error('Error in level/controller.js/deleteUtxo(): ', err)
      this.handleError(ctx, err)
    }
  }

  /**
   * @api {get} /level/pinclaim/:claimId Get pin claim data from LevelDB
   * @apiPermission public
   * @apiName GetLevelPinClaim
   * @apiGroup REST Level
   *
   * @apiParam {String} claimId Pin claim ID to retrieve
   *
   * @apiExample Example usage:
   * curl -H "Content-Type: application/json" -X GET localhost:5001/level/pinclaim/1234567890abcdef
   *
   * @apiSuccess {Object} Pin claim data from LevelDB
   */
  async getPinClaim (ctx) {
    try {
      const { claimId } = ctx.params

      const result = await this.adapters.level.pinClaimDb.get(claimId)

      ctx.body = result
    } catch (err) {
      wlogger.error('Error in level/controller.js/getPinClaim(): ', err)
      this.handleError(ctx, err)
    }
  }

  /**
   * @api {post} /level/pinclaim Create a new pin claim entry in LevelDB
   * @apiPermission public
   * @apiName CreateLevelPinClaim
   * @apiGroup REST Level
   *
   * @apiParam {String} claimId Pin claim ID
   * @apiParam {Object} claimData Pin claim data to store
   *
   * @apiExample Example usage:
   * curl -H "Content-Type: application/json" -X POST -d '{ "claimId": "1234567890abcdef", "claimData": { "txid": "1234567890abcdef", "ipfsHash": "QmHash...", "amount": 1000, "timestamp": 1234567890 } }' localhost:5001/level/pinclaim
   *
   * @apiSuccess {String} claimId Pin claim ID
   * @apiSuccess {Boolean} success Success status
   */
  async createPinClaim (ctx) {
    try {
      const { claimId, claimData } = ctx.request.body

      await this.adapters.level.pinClaimDb.put(claimId, claimData)

      ctx.body = {
        claimId,
        success: true
      }
    } catch (err) {
      wlogger.error('Error in level/controller.js/createPinClaim(): ', err)
      this.handleError(ctx, err)
    }
  }

  /**
   * @api {put} /level/pinclaim/:claimId Update an existing pin claim in LevelDB
   * @apiPermission public
   * @apiName UpdateLevelPinClaim
   * @apiGroup REST Level
   *
   * @apiParam {String} claimId Pin claim ID to update
   * @apiParam {Object} claimData Updated pin claim data
   *
   * @apiExample Example usage:
   * curl -H "Content-Type: application/json" -X PUT -d '{ "claimData": { "txid": "1234567890abcdef", "ipfsHash": "QmHash...", "amount": 1500, "timestamp": 1234567891, "status": "confirmed" } }' localhost:5001/level/pinclaim/1234567890abcdef
   *
   * @apiSuccess {String} claimId Pin claim ID
   * @apiSuccess {Boolean} success Success status
   */
  async updatePinClaim (ctx) {
    try {
      const { claimId } = ctx.params
      const { claimData } = ctx.request.body

      await this.adapters.level.pinClaimDb.put(claimId, claimData)

      ctx.body = {
        claimId,
        success: true
      }
    } catch (err) {
      wlogger.error('Error in level/controller.js/updatePinClaim(): ', err)
      this.handleError(ctx, err)
    }
  }

  /**
   * @api {delete} /level/pinclaim/:claimId Delete a pin claim from LevelDB
   * @apiPermission public
   * @apiName DeleteLevelPinClaim
   * @apiGroup REST Level
   *
   * @apiParam {String} claimId Pin claim ID to delete
   *
   * @apiExample Example usage:
   * curl -H "Content-Type: application/json" -X DELETE localhost:5001/level/pinclaim/1234567890abcdef
   *
   * @apiSuccess {String} claimId Pin claim ID
   * @apiSuccess {Boolean} success Success status
   */
  async deletePinClaim (ctx) {
    try {
      const { claimId } = ctx.params

      await this.adapters.level.pinClaimDb.del(claimId)

      ctx.body = {
        claimId,
        success: true
      }
    } catch (err) {
      wlogger.error('Error in level/controller.js/deletePinClaim(): ', err)
      this.handleError(ctx, err)
    }
  }

  // Backup the DB.
  async backup (ctx) {
    try {
      // await this.adapters.dbBackup.backupDb()
      console.log('Backuping DB...')
      process.exit(0)
    } catch (err) {
      wlogger.error('Error in level/controller.js/backup(): ', err)
      this.handleError(ctx, err)
    }
  }

  // Restore the DB.
  async restore (ctx) {
    try {
      // await this.adapters.dbBackup.restoreDb()
      console.log('Restoring DB...')
      process.exit(0)
    } catch (err) {
      wlogger.error('Error in level/controller.js/restore(): ', err)
      this.handleError(ctx, err)
    }
  }
}

export default LevelRESTControllerLib

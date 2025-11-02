/*
  REST API library for the /level route.
  This provides API access to the LevelDBs.
*/

// Public npm libraries.
import Router from 'koa-router'

// Local libraries.
import LevelRESTControllerLib from './controller.js'
import Validators from '../middleware/validators.js'

class LevelRouter {
  constructor (localConfig = {}) {
    // Dependency Injection.
    this.adapters = localConfig.adapters
    if (!this.adapters) {
      throw new Error(
        'Instance of Adapters library required when instantiating LevelDB Controller.'
      )
    }
    this.useCases = localConfig.useCases
    if (!this.useCases) {
      throw new Error(
        'Instance of Use Cases library required when instantiating LevelDB Controller.'
      )
    }

    const dependencies = {
      adapters: this.adapters,
      useCases: this.useCases
    }

    // Encapsulate dependencies.
    this.levelRESTController = new LevelRESTControllerLib(dependencies)
    this.validators = new Validators()

    // Instantiate the router and set the base route.
    const baseUrl = '/level'
    this.router = new Router({ prefix: baseUrl })
  }

  attach (app) {
    if (!app) {
      throw new Error(
        'Must pass app object when attaching REST API controllers.'
      )
    }

    // Define the routes and attach the controller.
    // Address routes
    this.router.post('/addr', this.levelRESTController.createAddr)
    this.router.get('/addr/:addr', this.levelRESTController.getAddr)
    this.router.put('/addr/:addr', this.levelRESTController.updateAddr)
    this.router.delete('/addr/:addr', this.levelRESTController.deleteAddr)

    // Transaction routes
    this.router.post('/tx', this.levelRESTController.createTx)
    this.router.get('/tx/:txid', this.levelRESTController.getTx)
    this.router.put('/tx/:txid', this.levelRESTController.updateTx)
    this.router.delete('/tx/:txid', this.levelRESTController.deleteTx)

    // Token routes
    this.router.post('/token', this.levelRESTController.createToken)
    this.router.get('/token/:tokenId', this.levelRESTController.getToken)
    this.router.put('/token/:tokenId', this.levelRESTController.updateToken)
    this.router.delete('/token/:tokenId', this.levelRESTController.deleteToken)

    // Status routes
    this.router.post('/status', this.levelRESTController.createStatus)
    this.router.get('/status/:statusKey', this.levelRESTController.getStatus)
    this.router.put('/status', this.levelRESTController.updateStatus)
    this.router.delete('/status/:statusKey', this.levelRESTController.deleteStatus)

    // Processed Transaction routes
    this.router.post('/ptx', this.levelRESTController.createPTx)
    this.router.get('/ptx/:ptxKey', this.levelRESTController.getPTx)
    this.router.put('/ptx/:ptxKey', this.levelRESTController.updatePTx)
    this.router.delete('/ptx/:ptxKey', this.levelRESTController.deletePTx)

    // UTXO routes
    this.router.post('/utxo', this.levelRESTController.createUtxo)
    this.router.get('/utxo/:utxoKey', this.levelRESTController.getUtxo)
    this.router.put('/utxo/:utxoKey', this.levelRESTController.updateUtxo)
    this.router.delete('/utxo/:utxoKey', this.levelRESTController.deleteUtxo)

    // Pin Claim routes
    this.router.post('/pinclaim', this.levelRESTController.createPinClaim)
    this.router.get('/pinclaim/:claimId', this.levelRESTController.getPinClaim)
    this.router.put('/pinclaim/:claimId', this.levelRESTController.updatePinClaim)
    this.router.delete('/pinclaim/:claimId', this.levelRESTController.deletePinClaim)

    // Routes for DB backup and restore
    this.router.post('/backup', this.levelRESTController.backup)
    this.router.post('/restore', this.levelRESTController.restore)

    // Attach the Controller routes to the Koa app.
    app.use(this.router.routes())
    app.use(this.router.allowedMethods())
  }
}

// module.exports = BchRouter
export default LevelRouter

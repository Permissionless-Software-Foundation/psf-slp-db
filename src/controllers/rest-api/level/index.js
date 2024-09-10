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
    this.router.post('/addr', this.levelRESTController.createAddr)
    this.router.get('/addr/:addr', this.levelRESTController.getAddr)
    this.router.put('/addr/:addr', this.levelRESTController.updateAddr)
    this.router.delete('/addr/:addr', this.levelRESTController.deleteAddr)

    // Attach the Controller routes to the Koa app.
    app.use(this.router.routes())
    app.use(this.router.allowedMethods())
  }
}

// module.exports = BchRouter
export default LevelRouter

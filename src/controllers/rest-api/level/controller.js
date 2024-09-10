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
}

export default LevelRESTControllerLib

/*
  Unit tests for the REST API handler for the /slp endpoints.
*/

// Public npm libraries
import { assert } from 'chai'
import sinon from 'sinon'

// Local support libraries
import adapters from '../../../mocks/adapters/index.js'
import UseCasesMock from '../../../mocks/use-cases/index.js'
import SlpRouter from '../../../../../src/controllers/rest-api/slp/index.js'

let uut
let sandbox

describe('#SLP-REST-Router', () => {
  beforeEach(() => {
    const useCases = new UseCasesMock()
    // Add SLP use cases mock
    useCases.slp = {
      getAddress: sinon.stub(),
      getTx: sinon.stub(),
      getToken: sinon.stub(),
      getStatus: sinon.stub()
    }

    uut = new SlpRouter({ adapters, useCases })

    sandbox = sinon.createSandbox()
  })

  afterEach(() => sandbox.restore())

  describe('#constructor', () => {
    it('should throw an error if adapters are not passed in', () => {
      try {
        uut = new SlpRouter()

        assert.fail('Unexpected code path')
      } catch (err) {
        assert.include(
          err.message,
          'Instance of Adapters library required when instantiating SLP REST Controller.'
        )
      }
    })

    it('should throw an error if useCases are not passed in', () => {
      try {
        uut = new SlpRouter({ adapters })

        assert.fail('Unexpected code path')
      } catch (err) {
        assert.include(
          err.message,
          'Instance of Use Cases library required when instantiating SLP REST Controller.'
        )
      }
    })
  })

  describe('#attach', () => {
    it('should throw an error if app is not passed in.', () => {
      try {
        uut.attach()

        assert.fail('Unexpected code path')
      } catch (err) {
        assert.include(
          err.message,
          'Must pass app object when attaching REST API controllers.'
        )
      }
    })

    it('should attach routes to app', () => {
      const mockApp = {
        use: sinon.stub()
      }

      uut.attach(mockApp)

      // Should call app.use twice (routes and allowedMethods)
      assert.isTrue(mockApp.use.calledTwice)
    })

    it('should register all routes', () => {
      const mockApp = {
        use: sinon.stub()
      }

      uut.attach(mockApp)

      // Verify router has the expected routes
      assert.isDefined(uut.router)
      assert.isDefined(uut.slpRESTController)
    })
  })
})

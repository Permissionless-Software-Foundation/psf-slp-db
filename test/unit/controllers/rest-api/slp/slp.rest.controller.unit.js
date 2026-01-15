/*
  Unit tests for the REST API handler for the /slp endpoints.
*/

// Public npm libraries
import { assert } from 'chai'
import sinon from 'sinon'

// Local support libraries
import adapters from '../../../mocks/adapters/index.js'
import UseCasesMock from '../../../mocks/use-cases/index.js'
import SlpController from '../../../../../src/controllers/rest-api/slp/controller.js'

import { context as mockContext } from '../../../../unit/mocks/ctx-mock.js'
let uut
let sandbox
let ctx

describe('#SLP-REST-Controller', () => {
  beforeEach(() => {
    const useCases = new UseCasesMock()
    // Add SLP use cases mock
    useCases.slp = {
      getAddress: sinon.stub(),
      getTx: sinon.stub(),
      getToken: sinon.stub(),
      getStatus: sinon.stub()
    }

    uut = new SlpController({ adapters, useCases })

    sandbox = sinon.createSandbox()

    // Mock the context object.
    ctx = mockContext()
  })

  afterEach(() => sandbox.restore())

  describe('#constructor', () => {
    it('should throw an error if adapters are not passed in', () => {
      try {
        uut = new SlpController()

        assert.fail('Unexpected code path')
      } catch (err) {
        assert.include(
          err.message,
          'Instance of Adapters library required when instantiating /slp REST Controller.'
        )
      }
    })

    it('should throw an error if useCases are not passed in', () => {
      try {
        uut = new SlpController({ adapters })

        assert.fail('Unexpected code path')
      } catch (err) {
        assert.include(
          err.message,
          'Instance of Use Cases library required when instantiating /slp REST Controller.'
        )
      }
    })
  })

  describe('#POST /slp/address', () => {
    it('should return 422 status on missing address', async () => {
      try {
        await uut.address(ctx)

        assert.fail('Unexpected result')
      } catch (err) {
        assert.equal(err.status, 422)
      }
    })

    it('should return 200 status on success', async () => {
      ctx.request.body = {
        address: 'bitcoincash:qqlrzp23w08434twmvr4fxw672whkjy0py26r63g3d'
      }

      const mockBalance = {
        utxos: [],
        txs: [],
        balances: []
      }
      uut.useCases.slp.getAddress.resolves(mockBalance)

      await uut.address(ctx)

      // Assert the expected HTTP response
      assert.equal(ctx.status, 200)

      // Assert that expected properties exist in the returned data.
      assert.property(ctx.response.body, 'balance')
      assert.isTrue(uut.useCases.slp.getAddress.calledOnce)
    })

    it('should return 422 status on use case error', async () => {
      ctx.request.body = {
        address: 'bitcoincash:qqlrzp23w08434twmvr4fxw672whkjy0py26r63g3d'
      }

      uut.useCases.slp.getAddress.rejects(new Error('test error'))

      try {
        await uut.address(ctx)

        assert.fail('Unexpected result')
      } catch (err) {
        assert.equal(err.status, 422)
        assert.include(err.message, 'test error')
      }
    })
  })

  describe('#POST /slp/tx', () => {
    it('should return 422 status on missing txid', async () => {
      try {
        await uut.tx(ctx)

        assert.fail('Unexpected result')
      } catch (err) {
        assert.equal(err.status, 422)
      }
    })

    it('should return 200 status on success', async () => {
      ctx.request.body = {
        txid: 'f3e14cd871402a766e85045dc552f2c1e87857dd3ea1b15efab6334ccef5e315'
      }

      const mockTxData = {
        txid: 'f3e14cd871402a766e85045dc552f2c1e87857dd3ea1b15efab6334ccef5e315',
        hash: 'f3e14cd871402a766e85045dc552f2c1e87857dd3ea1b15efab6334ccef5e315'
      }
      uut.useCases.slp.getTx.resolves(mockTxData)

      await uut.tx(ctx)

      // Assert the expected HTTP response
      assert.equal(ctx.status, 200)

      // Assert that expected properties exist in the returned data.
      assert.property(ctx.response.body, 'txData')
      assert.isTrue(uut.useCases.slp.getTx.calledOnce)
    })

    it('should return 422 status on use case error', async () => {
      ctx.request.body = {
        txid: 'f3e14cd871402a766e85045dc552f2c1e87857dd3ea1b15efab6334ccef5e315'
      }

      uut.useCases.slp.getTx.rejects(new Error('test error'))

      try {
        await uut.tx(ctx)

        assert.fail('Unexpected result')
      } catch (err) {
        assert.equal(err.status, 422)
        assert.include(err.message, 'test error')
      }
    })
  })

  describe('#POST /slp/token', () => {
    it('should return 422 status on missing tokenId', async () => {
      try {
        await uut.token(ctx)

        assert.fail('Unexpected result')
      } catch (err) {
        assert.equal(err.status, 422)
      }
    })

    it('should return 200 status on success', async () => {
      ctx.request.body = {
        tokenId: 'a4fb5c2da1aa064e25018a43f9165040071d9e984ba190c222a7f59053af84b2'
      }

      const mockTokenData = {
        tokenId: 'a4fb5c2da1aa064e25018a43f9165040071d9e984ba190c222a7f59053af84b2',
        name: 'Test Token',
        ticker: 'TEST'
      }
      uut.useCases.slp.getToken.resolves(mockTokenData)

      await uut.token(ctx)

      // Assert the expected HTTP response
      assert.equal(ctx.status, 200)

      // Assert that expected properties exist in the returned data.
      assert.property(ctx.response.body, 'tokenData')
      assert.isTrue(uut.useCases.slp.getToken.calledOnce)
      assert.isTrue(uut.useCases.slp.getToken.calledWith(mockTokenData.tokenId, undefined))
    })

    it('should pass withTxHistory flag to use case', async () => {
      ctx.request.body = {
        tokenId: 'a4fb5c2da1aa064e25018a43f9165040071d9e984ba190c222a7f59053af84b2',
        withTxHistory: true
      }

      const mockTokenData = {
        tokenId: 'a4fb5c2da1aa064e25018a43f9165040071d9e984ba190c222a7f59053af84b2',
        name: 'Test Token'
      }
      uut.useCases.slp.getToken.resolves(mockTokenData)

      await uut.token(ctx)

      assert.isTrue(uut.useCases.slp.getToken.calledWith(mockTokenData.tokenId, true))
    })

    it('should return 422 status on use case error', async () => {
      ctx.request.body = {
        tokenId: 'a4fb5c2da1aa064e25018a43f9165040071d9e984ba190c222a7f59053af84b2'
      }

      uut.useCases.slp.getToken.rejects(new Error('test error'))

      try {
        await uut.token(ctx)

        assert.fail('Unexpected result')
      } catch (err) {
        assert.equal(err.status, 422)
        assert.include(err.message, 'test error')
      }
    })
  })

  describe('#GET /slp/status', () => {
    it('should return 200 status on success', async () => {
      const mockStatus = {
        startBlockHeight: 543376,
        syncedBlockHeight: '543378',
        chainBlockHeight: '722004'
      }
      uut.useCases.slp.getStatus.resolves(mockStatus)

      await uut.status(ctx)

      // Assert the expected HTTP response
      assert.equal(ctx.status, 200)

      // Assert that expected properties exist in the returned data.
      assert.property(ctx.response.body, 'status')
      assert.isTrue(uut.useCases.slp.getStatus.calledOnce)
    })

    it('should return 422 status on use case error', async () => {
      uut.useCases.slp.getStatus.rejects(new Error('test error'))

      try {
        await uut.status(ctx)

        assert.fail('Unexpected result')
      } catch (err) {
        assert.equal(err.status, 422)
        assert.include(err.message, 'test error')
      }
    })
  })

  describe('#handleError', () => {
    it('should throw error with status if err.status is present', () => {
      try {
        const err = {
          status: 404,
          message: 'Not found'
        }

        uut.handleError(ctx, err)
      } catch (err) {
        assert.equal(err.status, 404)
        assert.include(err.message, 'Not found')
      }
    })

    it('should throw error with status even if no message', () => {
      try {
        const err = {
          status: 404
        }

        uut.handleError(ctx, err)
      } catch (err) {
        assert.equal(err.status, 404)
      }
    })

    it('should throw 422 error by default', () => {
      try {
        const err = {
          message: 'Some error'
        }

        uut.handleError(ctx, err)
      } catch (err) {
        assert.equal(err.status, 422)
        assert.include(err.message, 'Some error')
      }
    })
  })
})

/*
  Unit tests for the SLP use cases
*/

import { assert } from 'chai'
import sinon from 'sinon'

import SlpUseCases from '../../../src/use-cases/slp.js'

describe('#slp-use-cases', () => {
  let uut, sandbox

  beforeEach(() => {
    sandbox = sinon.createSandbox()

    const mockSlpQuery = {
      getAddress: sandbox.stub(),
      getTx: sandbox.stub(),
      getToken: sandbox.stub(),
      getStatus: sandbox.stub()
    }

    const mockBlacklist = {
      checkBlacklist: sandbox.stub()
    }

    const adapters = {
      slpQuery: mockSlpQuery,
      blacklist: mockBlacklist
    }

    uut = new SlpUseCases({ adapters })
  })

  afterEach(() => sandbox.restore())

  describe('#constructor', () => {
    it('should throw an error if adapters are not passed in', () => {
      try {
        const testUut = new SlpUseCases()

        console.log('testUut: ', testUut)
        assert.fail('Unexpected result')
      } catch (err) {
        assert.include(err.message, 'adapters must be passed in')
      }
    })

    it('should throw an error if slpQuery adapter is missing', async () => {
      const testUut = new SlpUseCases({
        adapters: {
          blacklist: {}
        }
      })

      // slpQuery is accessed lazily, so we need to call a method that uses it
      try {
        await testUut.getStatus()
        assert.fail('Unexpected result')
      } catch (err) {
        assert.include(err.message, 'slpQuery adapter is not available')
      }
    })

    it('should throw an error if blacklist adapter is missing', () => {
      try {
        uut = new SlpUseCases({
          adapters: {
            slpQuery: {}
          }
        })

        assert.fail('Unexpected result')
      } catch (err) {
        assert.include(err.message, 'blacklist adapter must be passed in')
      }
    })
  })

  describe('#getAddress', () => {
    it('should get address data from adapter', async () => {
      const mockData = { balance: 'test' }
      uut.slpQuery.getAddress.resolves(mockData)

      const result = await uut.getAddress('fake-addr')

      assert.equal(result, mockData)
      assert.isTrue(uut.slpQuery.getAddress.calledOnce)
      assert.isTrue(uut.slpQuery.getAddress.calledWith('fake-addr'))
    })

    it('should throw an error if address is not provided', async () => {
      try {
        await uut.getAddress()

        assert.fail('Unexpected result')
      } catch (err) {
        assert.include(err.message, 'Address required')
      }
    })
  })

  describe('#getTx', () => {
    it('should get transaction data from adapter', async () => {
      const mockData = { txid: 'test-tx' }
      uut.slpQuery.getTx.resolves(mockData)

      const result = await uut.getTx('fake-txid')

      assert.equal(result, mockData)
      assert.isTrue(uut.slpQuery.getTx.calledOnce)
      assert.isTrue(uut.slpQuery.getTx.calledWith('fake-txid'))
    })

    it('should throw an error if txid is not provided', async () => {
      try {
        await uut.getTx()

        assert.fail('Unexpected result')
      } catch (err) {
        assert.include(err.message, 'txid required')
      }
    })
  })

  describe('#getToken', () => {
    it('should get token data from adapter when not blacklisted', async () => {
      uut.blacklist.checkBlacklist.returns(false)
      const mockData = { tokenId: 'test-token', name: 'Test Token' }
      uut.slpQuery.getToken.resolves(mockData)

      const result = await uut.getToken('test-token', false)

      assert.equal(result, mockData)
      assert.isTrue(uut.blacklist.checkBlacklist.calledOnce)
      assert.isTrue(uut.blacklist.checkBlacklist.calledWith('test-token'))
      assert.isTrue(uut.slpQuery.getToken.calledOnce)
    })

    it('should return blacklisted response when token is blacklisted', async () => {
      uut.blacklist.checkBlacklist.returns(true)

      const result = await uut.getToken('blacklisted-token', false)

      assert.property(result, 'tokenId')
      assert.property(result, 'name')
      assert.equal(result.tokenId, 'blacklisted-token')
      assert.equal(result.name, 'not-available')
      assert.isTrue(uut.blacklist.checkBlacklist.calledOnce)
      assert.isFalse(uut.slpQuery.getToken.called)
    })

    it('should remove tx history when withTxHistory is false', async () => {
      uut.blacklist.checkBlacklist.returns(false)
      const mockData = {
        tokenId: 'test-token',
        name: 'Test Token',
        txs: [{ txid: 'tx1' }, { txid: 'tx2' }]
      }
      uut.slpQuery.getToken.resolves(mockData)

      const result = await uut.getToken('test-token', false)

      assert.notProperty(result, 'txs')
      assert.property(result, 'tokenId')
    })

    it('should keep tx history when withTxHistory is true', async () => {
      uut.blacklist.checkBlacklist.returns(false)
      const mockData = {
        tokenId: 'test-token',
        name: 'Test Token',
        txs: [{ txid: 'tx1' }, { txid: 'tx2' }]
      }
      uut.slpQuery.getToken.resolves(mockData)

      const result = await uut.getToken('test-token', true)

      assert.property(result, 'txs')
      assert.lengthOf(result.txs, 2)
    })

    it('should throw an error if tokenId is not provided', async () => {
      try {
        await uut.getToken()

        assert.fail('Unexpected result')
      } catch (err) {
        assert.include(err.message, 'tokenId required')
      }
    })
  })

  describe('#getStatus', () => {
    it('should get status data from adapter', async () => {
      const mockData = {
        startBlockHeight: 543376,
        syncedBlockHeight: '543378',
        chainBlockHeight: '722004'
      }
      uut.slpQuery.getStatus.resolves(mockData)

      const result = await uut.getStatus()

      assert.equal(result, mockData)
      assert.isTrue(uut.slpQuery.getStatus.calledOnce)
    })
  })
})

/*
  Unit tests for the slp-query adapter
*/

import { assert } from 'chai'
import sinon from 'sinon'

import SlpQuery from '../../../src/adapters/slp-query.js'

// Mock LevelDB
class MockLevel {
  async get (key) {
    return { mock: 'data', key }
  }
}

describe('#slp-query', () => {
  let uut, sandbox

  beforeEach(() => {
    sandbox = sinon.createSandbox()

    const addrDb = new MockLevel()
    const tokenDb = new MockLevel()
    const txDb = new MockLevel()
    const statusDb = new MockLevel()
    const localConfig = { addrDb, tokenDb, txDb, statusDb }

    uut = new SlpQuery(localConfig)
  })

  afterEach(() => sandbox.restore())

  describe('#constructor', () => {
    it('should throw an error if addrDb is missing', () => {
      try {
        uut = new SlpQuery({ tokenDb: {}, txDb: {}, statusDb: {} })

        assert.fail('Unexpected result')
      } catch (err) {
        assert.include(err.message, 'addrDb missing')
      }
    })

    it('should throw an error if tokenDb is missing', () => {
      try {
        uut = new SlpQuery({ addrDb: {}, txDb: {}, statusDb: {} })

        assert.fail('Unexpected result')
      } catch (err) {
        assert.include(err.message, 'tokenDb missing')
      }
    })

    it('should throw an error if txDb is missing', () => {
      try {
        uut = new SlpQuery({ addrDb: {}, tokenDb: {}, statusDb: {} })

        assert.fail('Unexpected result')
      } catch (err) {
        assert.include(err.message, 'txDb missing')
      }
    })

    it('should throw an error if statusDb is missing', () => {
      try {
        uut = new SlpQuery({ addrDb: {}, tokenDb: {}, txDb: {} })

        assert.fail('Unexpected result')
      } catch (err) {
        assert.include(err.message, 'statusDb missing')
      }
    })
  })

  describe('#getAddress', () => {
    it('should get an address from the database', async () => {
      sandbox.stub(uut.addrDb, 'get').resolves({ balance: 'test' })

      const result = await uut.getAddress('fake-addr')

      assert.property(result, 'balance')
      assert.equal(result.balance, 'test')
    })

    it('should throw an error if address is not passed in', async () => {
      try {
        await uut.getAddress()

        assert.fail('Unexpected result')
      } catch (err) {
        assert.equal(err.message, 'Address required when calling getAddress()')
      }
    })

    it('should handle database errors', async () => {
      sandbox.stub(uut.addrDb, 'get').rejects(new Error('DB error'))

      try {
        await uut.getAddress('fake-addr')

        assert.fail('Unexpected result')
      } catch (err) {
        assert.include(err.message, 'DB error')
      }
    })
  })

  describe('#getTx', () => {
    it('should get a transaction from the database', async () => {
      sandbox.stub(uut.txDb, 'get').resolves({ txid: 'test-tx' })

      const result = await uut.getTx('fake-txid')

      assert.property(result, 'txid')
      assert.equal(result.txid, 'test-tx')
    })

    it('should throw an error if txid is not passed in', async () => {
      try {
        await uut.getTx()

        assert.fail('Unexpected result')
      } catch (err) {
        assert.equal(err.message, 'txid required when calling getTx()')
      }
    })

    it('should handle database errors', async () => {
      sandbox.stub(uut.txDb, 'get').rejects(new Error('DB error'))

      try {
        await uut.getTx('fake-txid')

        assert.fail('Unexpected result')
      } catch (err) {
        assert.include(err.message, 'DB error')
      }
    })
  })

  describe('#getToken', () => {
    it('should get a token from the database', async () => {
      sandbox.stub(uut.tokenDb, 'get').resolves({ tokenId: 'test-token' })

      const result = await uut.getToken('fake-token-id')

      assert.property(result, 'tokenId')
      assert.equal(result.tokenId, 'test-token')
    })

    it('should throw an error if tokenId is not passed in', async () => {
      try {
        await uut.getToken()

        assert.fail('Unexpected result')
      } catch (err) {
        assert.equal(err.message, 'tokenId required when calling getToken()')
      }
    })

    it('should handle database errors', async () => {
      sandbox.stub(uut.tokenDb, 'get').rejects(new Error('DB error'))

      try {
        await uut.getToken('fake-token-id')

        assert.fail('Unexpected result')
      } catch (err) {
        assert.include(err.message, 'DB error')
      }
    })
  })

  describe('#getStatus', () => {
    it('should get status from the database', async () => {
      const mockStatus = {
        startBlockHeight: 543376,
        syncedBlockHeight: '543378',
        chainBlockHeight: '722004'
      }
      sandbox.stub(uut.statusDb, 'get').resolves(mockStatus)

      const result = await uut.getStatus()

      assert.property(result, 'startBlockHeight')
      assert.equal(result.startBlockHeight, 543376)
    })

    it('should handle database errors', async () => {
      sandbox.stub(uut.statusDb, 'get').rejects(new Error('DB error'))

      try {
        await uut.getStatus()

        assert.fail('Unexpected result')
      } catch (err) {
        assert.include(err.message, 'DB error')
      }
    })
  })
})

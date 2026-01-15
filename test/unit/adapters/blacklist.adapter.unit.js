/*
  Unit tests for the blacklist adapter
*/

import { assert } from 'chai'
import sinon from 'sinon'

import Blacklist from '../../../src/adapters/blacklist.js'

describe('#blacklist', () => {
  let uut, sandbox

  beforeEach(() => {
    sandbox = sinon.createSandbox()
    uut = new Blacklist()
  })

  afterEach(() => {
    sandbox.restore()
  })

  describe('#checkBlacklist', () => {
    it('should return false for token not in blacklist', () => {
      // Set blacklist directly for test
      uut.blacklist = ['token1', 'token2']
      const result = uut.checkBlacklist('token3')

      assert.equal(result, false)
    })

    it('should return true for token in blacklist', () => {
      // Set blacklist directly for test
      uut.blacklist = ['token1', 'token2', 'token3']
      const result = uut.checkBlacklist('token2')

      assert.equal(result, true)
    })

    it('should return false for empty blacklist', () => {
      // Set blacklist directly for test
      uut.blacklist = []
      const result = uut.checkBlacklist('any-token')

      assert.equal(result, false)
    })

    it('should handle error and throw', () => {
      // Force error by setting blacklist to null
      uut.blacklist = null

      try {
        uut.checkBlacklist('token')
        assert.fail('Unexpected result')
      } catch (err) {
        // The error will be caught and re-thrown with "Error in checkBlacklist" message
        assert.include(err.message, 'Error in checkBlacklist')
      }
    })
  })
})

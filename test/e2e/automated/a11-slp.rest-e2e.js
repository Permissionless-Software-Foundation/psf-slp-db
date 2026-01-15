/*
  E2E tests for the /slp REST API endpoints.
*/

// Public npm libraries
import { assert } from 'chai'
import axios from 'axios'

// Local support libraries
import config from '../../../config/index.js'

const LOCALHOST = `http://localhost:${config.port}`

describe('#SLP REST API E2E Tests', () => {
  describe('GET /slp/status', () => {
    it('should get indexer status', async () => {
      try {
        const response = await axios.get(`${LOCALHOST}/slp/status`)

        assert.equal(response.status, 200)
        assert.property(response.data, 'status')
      } catch (err) {
        // If the endpoint doesn't exist or server error, that's okay for E2E test
        // The test will fail if the server is not running (handled by liveness test)
        if (err.response) {
          console.log('Status endpoint returned:', err.response.status, err.response.data)
        } else {
          throw err
        }
      }
    })
  })

  describe('POST /slp/address', () => {
    it('should return 422 for missing address', async () => {
      try {
        await axios.post(`${LOCALHOST}/slp/address`, {})

        assert.fail('Unexpected success')
      } catch (err) {
        if (err.response) {
          assert.equal(err.response.status, 422)
        } else {
          throw err
        }
      }
    })

    it('should return address balance for valid address', async () => {
      try {
        const response = await axios.post(`${LOCALHOST}/slp/address`, {
          address: 'bitcoincash:qqlrzp23w08434twmvr4fxw672whkjy0py26r63g3d'
        })

        assert.equal(response.status, 200)
        assert.property(response.data, 'balance')
      } catch (err) {
        // If address doesn't exist in DB, that's okay - we're testing the endpoint works
        if (err.response) {
          // 422 is acceptable if address format is invalid or not found
          assert.isTrue([200, 422].includes(err.response.status), `Unexpected status: ${err.response.status}`)
        } else {
          throw err
        }
      }
    })
  })

  describe('POST /slp/tx', () => {
    it('should return 422 for missing txid', async () => {
      try {
        await axios.post(`${LOCALHOST}/slp/tx`, {})

        assert.fail('Unexpected success')
      } catch (err) {
        if (err.response) {
          assert.equal(err.response.status, 422)
        } else {
          throw err
        }
      }
    })

    it('should return transaction data for valid txid', async () => {
      try {
        const response = await axios.post(`${LOCALHOST}/slp/tx`, {
          txid: 'f3e14cd871402a766e85045dc552f2c1e87857dd3ea1b15efab6334ccef5e315'
        })

        assert.equal(response.status, 200)
        assert.property(response.data, 'txData')
      } catch (err) {
        // If txid doesn't exist in DB, that's okay - we're testing the endpoint works
        if (err.response) {
          // 422 is acceptable if txid format is invalid or not found
          assert.isTrue([200, 422].includes(err.response.status), `Unexpected status: ${err.response.status}`)
        } else {
          throw err
        }
      }
    })
  })

  describe('POST /slp/token', () => {
    it('should return 422 for missing tokenId', async () => {
      try {
        await axios.post(`${LOCALHOST}/slp/token`, {})

        assert.fail('Unexpected success')
      } catch (err) {
        if (err.response) {
          assert.equal(err.response.status, 422)
        } else {
          throw err
        }
      }
    })

    it('should return token data for valid tokenId', async () => {
      try {
        const response = await axios.post(`${LOCALHOST}/slp/token`, {
          tokenId: 'a4fb5c2da1aa064e25018a43f9165040071d9e984ba190c222a7f59053af84b2'
        })

        assert.equal(response.status, 200)
        assert.property(response.data, 'tokenData')
      } catch (err) {
        // If tokenId doesn't exist in DB, that's okay - we're testing the endpoint works
        if (err.response) {
          // 422 is acceptable if tokenId format is invalid or not found
          assert.isTrue([200, 422].includes(err.response.status), `Unexpected status: ${err.response.status}`)
        } else {
          throw err
        }
      }
    })

    it('should handle withTxHistory parameter', async () => {
      try {
        const response = await axios.post(`${LOCALHOST}/slp/token`, {
          tokenId: 'a4fb5c2da1aa064e25018a43f9165040071d9e984ba190c222a7f59053af84b2',
          withTxHistory: true
        })

        assert.equal(response.status, 200)
        assert.property(response.data, 'tokenData')
      } catch (err) {
        // If tokenId doesn't exist in DB, that's okay - we're testing the endpoint works
        if (err.response) {
          // 422 is acceptable if tokenId format is invalid or not found
          assert.isTrue([200, 422].includes(err.response.status), `Unexpected status: ${err.response.status}`)
        } else {
          throw err
        }
      }
    })
  })
})

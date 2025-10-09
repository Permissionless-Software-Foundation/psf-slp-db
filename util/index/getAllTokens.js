/*
  Utility tool to retrieve all token keys in the token DB.
*/

// const level = require('level')
import level from 'level'

// Hack to get __dirname back.
// https://blog.logrocket.com/alternatives-dirname-node-js-es-modules/
import * as url from 'url'
const __dirname = url.fileURLToPath(new URL('.', import.meta.url))


const tokenDb = level(`${__dirname.toString()}/../../leveldb/current/tokens`, {
  valueEncoding: 'json'
})

async function getTokens () {
  try {
    const stream = tokenDb.createReadStream()

    stream.on('data', function (data) {
      // console.log(data.key, ' = ', data.value)

      if (data.value.totalBurned !== '0' && data.value.totalBurned !== data.value.totalMinted) {
        data.value.totalTxs = data.value.txs.length
        data.value.txs = []
        console.log(data.key, ' = ', data.value)
      }
    })
  } catch (err) {
    console.error(err)
  }
}
getTokens()

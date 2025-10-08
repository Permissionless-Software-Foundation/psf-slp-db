/*
  Utility tool to retrieve all token keys in the token DB.
*/

// Public npm libraries.
import { Level } from 'level'

// Hack to get __dirname back.
// https://blog.logrocket.com/alternatives-dirname-node-js-es-modules/
import * as url from 'url'
const __dirname = url.fileURLToPath(new URL('.', import.meta.url))

const tokenDb = new Level(`${__dirname.toString()}/../../leveldb/current/tokens`, {
  valueEncoding: 'json'
})

async function getTokens () {
  try {
    // Level v8 uses async iterators instead of streams
    for await (const [key, value] of tokenDb.iterator()) {
      // console.log(key, ' = ', value)

      if (value.totalBurned !== '0' && value.totalBurned !== value.totalMinted) {
        value.totalTxs = value.txs.length
        value.txs = []
        console.log(key, ' = ', value)
      }
    }
  } catch (err) {
    console.error(err)
  }
}
getTokens()
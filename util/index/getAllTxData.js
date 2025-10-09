/*
  Utility tool to retrieve all token keys in the token DB.
*/

// const level = require('level')
import level from 'level'

// Hack to get __dirname back.
// https://blog.logrocket.com/alternatives-dirname-node-js-es-modules/
import * as url from 'url'
const __dirname = url.fileURLToPath(new URL('.', import.meta.url))

const txDb = level(`${__dirname.toString()}/../../leveldb/current/txs`, {
  valueEncoding: 'json'
})

async function getTxs () {
  try {
    const stream = txDb.createReadStream()

    stream.on('data', function (data) {
      console.log(data.key, ' = ', JSON.stringify(data.value, null, 2))
    })
  } catch (err) {
    console.error(err)
  }
}
getTxs()

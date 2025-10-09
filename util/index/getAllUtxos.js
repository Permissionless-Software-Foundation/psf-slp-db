/*
  Utility tool to retrieve all token keys in the token DB.
*/

// const level = require('level')
import level from 'level'

// Hack to get __dirname back.
// https://blog.logrocket.com/alternatives-dirname-node-js-es-modules/
import * as url from 'url'
const __dirname = url.fileURLToPath(new URL('.', import.meta.url))

const utxoDb = level(`${__dirname.toString()}/../../leveldb/current/utxos`, {
  valueEncoding: 'json'
})

async function getUtxos () {
  try {
    const stream = utxoDb.createReadStream()

    stream.on('data', function (data) {
      console.log(data.key, ' = ', data.value)
    })
  } catch (err) {
    console.error(err.message)
  }
}
getUtxos()

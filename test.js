const assert = require('assert')

let Client = require('./index.js')

let client = new Client({
  port: 4028,
  host: '192.168.1.120'
})

client.sendCommand('summary', function (err, response) {
  assert(!err)
  assert.equal(Object.keys(response)[0], 'STATUS')
})

assert(client)

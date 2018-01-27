const assert = require('assert')

let Client = require('./index.js')

let client = new Client({
  port: 4028,
  host: '192.168.1.120'
})

client.sendCommand('summary', function (err, response) {
  assert(!err)
  console.log(response)
  assert.equal(Object.keys(response)[1], 'SUMMARY')
  // console.log(response['SUMMARY'][0]["GHS 5s"])
})
client.sendCommand('pools', function (err, response) {
  assert(!err)
  console.log(response)
  assert.equal(Object.keys(response)[1], 'POOLS')
})

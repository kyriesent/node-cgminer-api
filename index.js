const net = require('net')

let Client = function (options) {
  this.socket = new net.Socket()

  this.socket.on('connect', function () {
    console.log('this.socket.on connect')
  })

  this.socket.on('close', function (hadError) {
    console.log(hadError)
  })

  this.socket.on('timeout', function () {
    console.log('this.socket.on timeout')
  })

  this.socket.connect(options)

  return this
}

Client.prototype.sendCommand = function (command, cb) {
  var dataBuf = Buffer.from([])
  var cbCalled = false
  var debouncedCb = function () {
    if (!cbCalled) {
      cbCalled = true
      cb.apply(null, arguments)
    }
  }

  let request = {
    command: command
  }
  this.socket.write(JSON.stringify(request))
  this.socket.on('data', function (data) {
    dataBuf = Buffer.concat([dataBuf, data])
  })

  this.socket.on('end', function () {
    let string = dataBuf.toString()
    // let lastchar = string.slice(-1)
    string.slice(-1)
    string = string.substr(0, string.length - 1)

    let dataObj = JSON.parse(string)
    console.log(dataObj)
    debouncedCb(null, dataObj)
  })

  this.socket.on('error', function (error) {
    debouncedCb(error)
  })
}

module.exports = Client

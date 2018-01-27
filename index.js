const net = require('net')

let Client = function (options) {
  let pendingCommands = []
  let executingCommands = false

  this.sendCommand = function (command, params, cb) {
    if (arguments.length === 2) {
      cb = params
      params = undefined
    }
    pendingCommands.push(new Command(command, params, cb))

    if (!executingCommands) {
      beginExecution()
    }
  }

  let beginExecution = function () {
    if (pendingCommands.length === 0) {
      executingCommands = false
      return
    }
    executingCommands = true
    let currentCommand = pendingCommands.splice(0, 1)[0]
    executeCommand(currentCommand, function (err, response) {
      currentCommand.callback.call(null, err, response)
      beginExecution()
    })
  }

  let executeCommand = function (command, cb) {
    let socket = new net.Socket()
    let dataBuf = Buffer.from([])
    let request = {
      command: command.commandName
    }
    var cbCalled = false

    socket.on('connect', function () {
      socket.write(JSON.stringify(request))
    })

    socket.on('data', function (data) {
      dataBuf = Buffer.concat([dataBuf, data])
    })

    socket.on('end', function () {
      let string = dataBuf.toString()

      // Remove \u0000 (0x00) byte from end of JSON, screws up JSON parsing
      let lastchar = string.slice(-1)
      let regex = new RegExp(lastchar + '$', 'g')
      string = string.replace(regex, '')

      let dataObj = JSON.parse(string)
      debouncedCb(null, dataObj)
    })

    socket.on('error', function (error) {
      debouncedCb(error)
    })

    socket.connect(options)

    const debouncedCb = function () {
      if (!cbCalled) {
        cbCalled = true
        clean()
        cb.apply(null, arguments)
      }
    }
    const clean = function () {
      socket.removeAllListeners('data')
      socket.removeAllListeners('end')
      socket.removeAllListeners('error')
    }
  }

  return this
}

let Command = function (commandName, params, cb) {
  this.commandName = commandName
  this.params = params
  this.callback = cb
}

module.exports = Client

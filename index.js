const net = require('net');

let socket = new net.Socket();
let dataBuf = Buffer.from([]);

socket.on('connect', function () {
    console.log("socket.on connect");
    let request = {
        command: 'summary'
    }
    socket.write(JSON.stringify(request));
});

socket.on('data', function (data) {
    console.log("socket.on data");
    dataBuf = Buffer.concat([dataBuf, data]);
});

socket.on('end', function () {
    console.log("socket.on end");
    console.log(dataBuf.toString('hex'));
    let string = dataBuf.toString();
    let lastchar = string.slice(-1);
    string = string.substr(0, string.length - 1)
    console.log(string);

    let dataObj = JSON.parse(string);
    console.log(dataObj);
});

socket.on('error', function (error) {
    console.log("socket.on error");
    console.log(error);
});

socket.on('close', function (had_error) {
    console.log("socket.on close");
    console.log(had_error);
});

socket.on('timeout', function () {
    console.log("socket.on timeout");
});

socket.connect({
    port: 4028,
    host: '192.168.1.120'
});


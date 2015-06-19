#! /usr/bin/env node
var fs = require('fs')
  , http = require('http')
  , open = require('open')
  , argv = require('minimist')(process.argv.slice(2))
  , net = require('net')
  , socket = require('socket.io')
  , proxy = require('http-proxy')
  , connect = require('connect')
  // , injector = require('connect-inject')
  , harmon = require('harmon')
  , watch = require('node-watch')
  , portscanner = require('portscanner')
  , httpServer, socketServer, proxyServer
  , httpServerPort = argv.H || 80
  , socketServerPort = argv.S || 31396
  , proxyServerPort = argv.P || 8090
  , docRoot = argv.D;

/**
 * set cli option
 */
opt = require('node-getopt').create([
  ['H' , '', 'http server port, default port is 80'],
  ['P' , '', 'proxy server port, default port is 8090'],
  ['S' , '', 'websocket server port, default port is 31396'],
  ['D' , '', 'http server\'s docRoot'],
  ['h' , '', 'display this help'],
  ['v' , '', 'show version']
])              // create Getopt instance
.bindHelp()     // bind option 'help' to default action
.parseSystem(); // parse command line

if (argv.v) {
  var pjson = require('./package.json');
  console.log(pjson.name + '  Version ' + pjson.version)
  process.exit();
}

/**
 * websocket server 
 */
function setSocketServer() {
  socketServer = socket.listen(socketServerPort); 
  watch(docRoot, function(filename) {
    if (filename.substr(filename.lastIndexOf('.')) !== '.swp' && filename.substr(-1) !== '~') {
      socketServer.emit('reload')
      console.log(new Date().toUTCString() + ' File ' + filename + ' changed.');
    }
  });
}

/**
 * proxy server
 */
function setProxyServer() {
  var app = connect();
  var injectCode = "<script src='http://localhost:" + socketServerPort + "/socket.io/socket.io.js'></script><script>"
    + " var socket = io.connect('http://localhost:" + socketServerPort + "');"
    + " socket.on('reload', function() {location.reload()});"
    + " </script>";

  proxyServer = proxy.createProxyServer(
    {target: 'http://localhost:' + httpServerPort}
  );

  // TODO: inject script to response

  app.use(function(req, res) {
    proxyServer.web(req, res);
  });

  http.createServer(app).listen(proxyServerPort);

  console.log(new Date().toUTCString() + ' Proxy server listening on ' + proxyServerPort);
  open('http://localhost:' + proxyServerPort);
}

/**
 * check cli arguments
 */
function checkParam(callback) {
  var flag = 0;
  var yes = 0;
  portscanner.checkPortStatus(httpServerPort, '127.0.0.1', function(error, status) {
    // Status is 'open' if currently in use or 'closed' if available
    flag += 1;
    if (status === 'closed') {
      console.log('Error: There is no http server on port ' + httpServerPort + '.');
    } else {
      yes += 1;
    }
    if (flag == 3) {
      if (yes == 3) {
        callback(true);
      } else {
        callback(false);
      }
    } 
  })
  portscanner.checkPortStatus(proxyServerPort, '127.0.0.1', function(error, status) {
    flag += 1;
    if (status === 'open') {
      console.log('Error: Port ' + proxyServerPort + ' is taken by other process.');
    } else {
      yes += 1;
    }
    if (flag == 3) {
      if (yes == 3) {
        callback(true);
      } else {
        callback(false);
      }
    } 
  })
  fs.exists(docRoot, function(result) {
    flag += 1;
    if (! result) {
      console.log('Error: The path didn\'t exists in file system.');
    } else {
      yes += 1;
    }
    if (flag == 3) {
      if (yes == 3) {
        callback(true);
      } else {
        callback(false);
      }
    } 
  });
}

/**
 * start server
 */
if (typeof docRoot == 'undefined') {
  console.log('Miss the DocRoot, for example: reload-man -D /var/www/foo');
  process.exit();
} else if (! fs.existsSync(docRoot)) {
  console.log('Error: ' + docRoot + ' doesn\'t exists.');
  process.exit();
}

checkParam(function(result) {
  if (result) {
    setSocketServer();
    setProxyServer();
  } else {
    process.exit();
  }
});

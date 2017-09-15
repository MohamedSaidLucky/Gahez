const WebSocket = require('ws');

const ws = new WebSocket('ws://localhost:28900');

ws.on('open', function open() {
  ws.send('something');
});

ws.on('message', function incoming(data) {
  console.log(data);
});
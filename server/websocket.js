const WebSocket = require('ws');

function setupWebSocket(server) {
  const wss = new WebSocket.Server({ server });

  wss.on('connection', (ws) => {
    ws.on('message', (message) => {
      // Handle incoming messages
    });

    // Send updates to connected clients
    ws.send(JSON.stringify({ type: 'connection', message: 'Connected to WebSocket' }));
  });

  return wss;
}

module.exports = setupWebSocket; 
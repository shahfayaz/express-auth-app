const io = require('socket.io-client');

const socket = io('http://localhost:3011');

socket.on('connect', () => {
  console.log('Successfully connected to server with ID:', socket.id);
  
  // Test ping-pong
  console.log('Sending ping...');
  socket.emit('ping');
});

socket.on('pong', (data) => {
  console.log('Received pong:', data);
  socket.disconnect();
  process.exit(0);
});

socket.on('connect_error', (err) => {
  console.error('Connection error:', err.message);
  process.exit(1);
});

// Timeout if no response
setTimeout(() => {
  console.error('Timeout waiting for pong');
  process.exit(1);
}, 5000);

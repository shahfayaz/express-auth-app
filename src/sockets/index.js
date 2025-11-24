module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });

    // Example event
    socket.on('ping', () => {
      socket.emit('pong', { message: 'Hello from server', timestamp: Date.now() });
    });
  });
};

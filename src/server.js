const app = require('./app');
const sequelize = require('./config/database');

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');
    
    // Sync models (create tables if they don't exist)
    // In production, you might want to use migrations instead of sync({ force: true }) or sync()
    await sequelize.sync({ force: false, alter: true }); 
    console.log('Database synchronized.');

    const server = app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });

    // Initialize Socket.IO
    const io = require('socket.io')(server, {
      cors: {
        origin: "*", // Allow all origins for now, configure as needed
        methods: ["GET", "POST"]
      }
    });

    require('./sockets')(io);

  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}

startServer();

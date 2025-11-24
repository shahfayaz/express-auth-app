const app = require('./app');
const sequelize = require('./config/database');

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ force: true });
    console.log('Database connection has been established successfully.');
    
    // Sync models (create tables if they don't exist)
    // In production, you might want to use migrations instead of sync({ force: true }) or sync()
    await sequelize.sync(); 
    console.log('Database synchronized.');

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}

startServer();

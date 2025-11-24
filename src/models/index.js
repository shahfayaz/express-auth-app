const sequelize = require('../config/database');
const User = require('./user');
const Session = require('./session');

const db = {
  sequelize,
  User,
  Session,
};

module.exports = db;

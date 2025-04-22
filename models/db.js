// db.js
const { Sequelize } = require('sequelize');

// Create an instance of Sequelize for SQLite
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite', // Path to your SQLite database
});

module.exports = sequelize;

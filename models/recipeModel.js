// models/recipe.js
const { DataTypes } = require('sequelize');
const sequelize = require('./db');
const User = require('./userModel');

// Define the Recipe model
const Recipe = sequelize.define('Recipe', {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  ingredients: {
    type: DataTypes.JSON,
    allowNull: false,
  },
  instructions: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
});

// Set up relationship: A Recipe belongs to a User
Recipe.belongsTo(User, {
  foreignKey: {
    allowNull: false,
  },
});

module.exports = Recipe;

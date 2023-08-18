const { DataTypes } = require('sequelize');
const { db } = require('../database/config');

const Post = db.define('posts', {
  id: {
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
    type: DataTypes.INTEGER,
  },
  tittle: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('Active', 'Disabled'),
    allowNull: false,
    defaultValue: 'Active',
  },
});

const postStatus = Object.freeze({
  active: 'Active',
  disabled: 'Disabled',
});

module.exports = { Post, postStatus };

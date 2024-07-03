const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

module.exports = sequelize.define("Comment", {
    post_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        onDelete: 'CASCADE'
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        onDelete: 'CASCADE'
    },
    content: {
        type: DataTypes.STRING,
        allowNull: false,
    }
})
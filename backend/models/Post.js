const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

module.exports = sequelize.define("Post", {
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        onDelete: "CASCADE"
    },
    content: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    image: {
        type: DataTypes.STRING,
        allowNull: true
    },
})
const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const User = sequelize.define('User', {
    username: {
        type: DataTypes.STRING,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    role: {
        type: DataTypes.STRING,
        allowNull: false
    },
    createdAt: {
        type: DataTypes.DATE,
        field: 'createdat', // Match the exact column name
        defaultValue: DataTypes.NOW
    },
    updatedAt: {
        type: DataTypes.DATE,
        field: 'updatedat', // Match the exact column name
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'users', // Specify the table name here
    timestamps: true // Enable timestamps to automatically manage createdAt and updatedAt fields
});

module.exports = User;

const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const Category = sequelize.define('Category', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    image: {
        type: DataTypes.STRING,
        defaultValue: 'default.png'
    },
    createdAt: {
        type: DataTypes.DATE,
        field: 'createdat',
        defaultValue: DataTypes.NOW
    },
    updatedAt: {
        type: DataTypes.DATE,
        field: 'updatedat',
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'categories',
    timestamps: true
});

module.exports = Category;

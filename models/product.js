const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');
const Category = require('./category');

const Product = sequelize.define('Product', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT
    },
    price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    image: {
        type: DataTypes.STRING,
        defaultValue: 'default.png'
    },
    categoryId: {
        type: DataTypes.INTEGER,
        field: 'categoryid', // Match the exact column name
        references: {
            model: 'categories', // Use the table name as a string
            key: 'id'
        }
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
    tableName: 'products',
    timestamps: true
});

// Define association
Product.belongsTo(Category, { foreignKey: 'categoryId' });

module.exports = Product;

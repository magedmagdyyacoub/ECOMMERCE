const Sequelize = require('sequelize');
const sequelize = require('../config/sequelize');

const User = require('./user');
const Category = require('./category');
const Product = require('./product');
const CartItem = require('./cartItem'); // Ensure the file name is correct
const Order = require('./order');
const OrderItem = require('./orderitem');

// Define associations
User.hasMany(CartItem, { foreignKey: 'userId' });
CartItem.belongsTo(User, { foreignKey: 'userId' });

Product.hasMany(CartItem, { foreignKey: 'productId' });
CartItem.belongsTo(Product, { foreignKey: 'productId' });

Category.hasMany(Product, { foreignKey: 'categoryId' });
Product.belongsTo(Category, { foreignKey: 'categoryId' });

Order.hasMany(OrderItem, { as: 'items', foreignKey: 'order_id' });
OrderItem.belongsTo(Order, { foreignKey: 'order_id' });

module.exports = {
  sequelize,
  User,
  Category,
  Product,
  CartItem,
  Order,
  OrderItem
};

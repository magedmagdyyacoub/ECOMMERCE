const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');
const Order = require('./order');

const OrderItem = sequelize.define('OrderItem', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  order_id: {
    type: DataTypes.UUID,
    allowNull: false,
    field: 'order_id',
    references: {
      model: Order,
      key: 'id'
    }
  },
  product_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  total: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
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
  tableName: 'order_items',
  timestamps: true
});

// Define association
OrderItem.belongsTo(Order, { foreignKey: 'order_id' });

module.exports = OrderItem;

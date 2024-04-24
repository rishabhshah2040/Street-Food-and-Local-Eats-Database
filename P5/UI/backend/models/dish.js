const { Sequelize, sequelize } = require('../db'); // Adjust the path as needed

const Dish = sequelize.define('Dish', {
  dishId: {
    type: Sequelize.INTEGER,
    primaryKey: true
  },
  MenuID: Sequelize.INTEGER,
  MainIngredient: Sequelize.STRING,
  Allergen: Sequelize.STRING,
  DishName: Sequelize.STRING,
  Description: Sequelize.STRING
}, {
  tableName: 'Dish',
  timestamps: false
});

module.exports = Dish;

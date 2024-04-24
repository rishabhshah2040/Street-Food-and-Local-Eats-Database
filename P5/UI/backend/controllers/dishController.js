const Dish = require('../models/dish');

const createDish = async (req, res) => {
  const { dishId, MenuID, MainIngredient, Allergen, DishName, Description } = req.body;
  Dish.create({ dishId, MenuID, MainIngredient, Allergen, DishName, Description })
    .then(() => {
      console.log('Dish created');
      res.send('Dish created successfully');
    })
    .catch(err => {
      console.error('Error creating dish:', err.message);
      res.status(500).send('Error creating dish');
    });
}

const readDish = async (req, res) => {

  Dish.findAll()
    .then(dishes => {
      
      res.send(dishes);
    })
    .catch(err => {
      console.error('Error retrieving dishes:', err);
      res.status(500).send('Error retrieving dishes');
    });
}

const updateDish = async (req, res) => {
  const { MenuID, MainIngredient, Allergen, DishName, Description } = req.body;
  Dish.update({ MenuID, MainIngredient, Allergen, DishName, Description }, { where: { dishId: req.params.dishId } })
    .then(() => {
      console.log('Dish updated');
      res.send('Dish updated successfully');
    })
    .catch(err => {
      console.error('Error updating dish:', err);
      res.status(500).send('Error updating dish');
    });
}

const deleteDish = async (req, res) => {
  Dish.destroy({ where: { dishId: req.params.dishId } })
    .then(() => {
      console.log('Dish deleted');
      res.send('Dish deleted successfully');
    })
    .catch(err => {
      console.error('Error deleting dish:', err);
      res.status(500).send('Error deleting dish');
    });
}

const getDishById = async (req, res) => {
  const DishID = req.params.id;
  console.log(DishID);
  Dish.findByPk(DishID)
    .then(dish => {
      console.log(dish)
      if (!dish) {
        return res.status(404).send('Dish not found');
      }
      res.send(dish);
    })
    .catch(err => {
      console.error('Error retrieving dish:', err);
      res.status(500).send('Error retrieving dish');
    });
}

module.exports = { createDish, deleteDish, readDish, updateDish, getDishById };
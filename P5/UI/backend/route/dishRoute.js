const express = require('express');
const {createDish, readDish, updateDish, deleteDish, getDishById} = require('../controllers/dishController')

const router = express.Router();
router.route('/create').post(createDish);
router.route('/read').get(readDish);
router.route('/update/:dishId').put(updateDish);
router.route('/delete/:dishId').delete(deleteDish);
router.route('/get/:id').get(getDishById);

module.exports = router;
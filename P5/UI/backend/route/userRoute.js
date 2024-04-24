const express = require('express');
const { createUser, readUsers, updateUser, deleteUser,getUserById } = require('../controllers/userController');

const router = express.Router();

router.route('/create').post(createUser);

router.route('/read').get(readUsers);

router.route('/update/:UserID').put(updateUser);

router.route('/delete/:UserID').delete(deleteUser);
router.route('/get/:id').get(getUserById);

module.exports = router;

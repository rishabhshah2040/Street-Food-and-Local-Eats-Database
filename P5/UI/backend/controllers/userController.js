const User = require('../models/user');

const createUser = async (req, res) => {
    const { UserID, UserName, Email, Phone, Address } = req.body;
    User.create({UserID, UserName, Email, Phone, Address })
        .then(() => {
            console.log('User created');
            res.send('User created successfully');
        })
        .catch(err => {
            console.error('Error creating user:', err);
            res.status(500).send('Error creating user');
        });
}

const readUsers = async (req, res) => {
    User.findAll()
        .then(users => {
            console.log('Users retrieved:', users);
            res.send(users);
        })
        .catch(err => {
            console.error('Error retrieving users:', err);
            res.status(500).send('Error retrieving users');
        });
}

const updateUser = async (req, res) => {
    console.log(req.params);
    const { UserName, Email, Phone, Address } = req.body;
    User.update({ UserName, Email, Phone, Address }, { where: { UserID: req.params.UserID } })
        .then(() => {
            console.log('User updated');
            res.send('User updated successfully');
        })
        .catch(err => {
            console.error('Error updating user:', err);
            res.status(500).send('Error updating user');
        });
}

const deleteUser = async (req, res) => {
    User.destroy({ where: { UserID: req.params.UserID } })
        .then(() => {
            console.log('User deleted');
            res.send('User deleted successfully');
        })
        .catch(err => {
            console.error('Error deleting user:', err);
            res.status(500).send('Error deleting user');
        });
}

const getUserById = async (req, res) => {
    const UserID = req.params.id;
    User.findByPk(UserID)
      .then(user => {
        if (!user) {
          return res.status(404).send('User not found');
        }
        res.send(user);
      })
      .catch(err => {
        console.error('Error retrieving user:', err);
        res.status(500).send('Error retrieving user');
      });
  }

module.exports = {
    createUser,
    readUsers,
    updateUser,
    deleteUser,
    getUserById
};

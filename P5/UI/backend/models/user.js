const { Sequelize, sequelize } = require('../db'); 

const User = sequelize.define('User', {
    UserID: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: false, 
        allowNull: false
    },
    UserName: {
        type: Sequelize.STRING(255),
        allowNull: false
    },
    Email: {
        type: Sequelize.STRING(255),
        allowNull: false,
        validate: {
            isEmail: true 
        }
    },
    Phone: {
        type: Sequelize.STRING(255),
        allowNull: true 
    },
    Address: {
        type: Sequelize.TEXT,
        allowNull: false
    }
}, {
    
    tableName: 'Users',
    timestamps: false 
});

module.exports = User;

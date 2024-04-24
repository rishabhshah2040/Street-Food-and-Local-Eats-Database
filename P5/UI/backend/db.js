const Sequelize = require('sequelize');

const sequelize = new Sequelize('DMDDFinalProject', 'DMDDHarshi', 'helloworld', {
  host: 'localhost',
  dialect: 'mssql',
  port: 57000,
  dialectOptions: {
    options: {
      encrypt: true,
    },
  },
});

module.exports = { Sequelize, sequelize };

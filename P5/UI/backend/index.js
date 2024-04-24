const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const Sequelize = require('sequelize');
const route = require('./route/index');

const app = express();
const port = 3000;
app.use(cors());

app.use(bodyParser.json());

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
  
  
sequelize.authenticate()
.then(() => {
  console.log('Connection has been successfully established.');
  sequelize.sync()
    .then(() => console.log('Database and tables synced'))
    .catch(err => console.error('Unable to sync database:', err.message));
})
.catch(err => {
  console.error('Unable to connect to the database:', err);
});





    route(app);
  
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });


  module.exports = {sequelize, app};
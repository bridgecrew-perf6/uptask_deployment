const { Sequelize } = require('sequelize');
//Extraer valores de variables.env
require('dotenv').config({path: 'variables.env'})

// Option 3: Passing parameters separately (other dialects)
const db = new Sequelize( 
  process.env.DB_NOMBRE, 
  process.env.DB_USER, 
  process.env.DB_PASS, 
  {
  host: process.env.DB_HOST,
  dialect: 'mysql', /* one of 'mysql' | 'mariadb' | 'postgres' | 'mssql' */
  port: process.env.DB_PORT
});
//Exportando 
module.exports = db;
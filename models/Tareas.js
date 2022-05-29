const Sequelize = require('sequelize');
const db = require('../config/db') //Importando connexion
const Proyectos = require('./Proyectos');

//Creando la tabla para tareas
const Tareas = db.define('tareas',{
    id:{
        type: Sequelize.INTEGER(11),
        primaryKey: true,
        autoIncrement: true
    },
    tarea: Sequelize.STRING(100),
    estado: Sequelize.INTEGER(1)
});
//Llave foránea
Tareas.belongsTo(Proyectos)
//Proyectos.hasMany(Tareas); //Un proyecto puede tener muchas tareas
module.exports = Tareas;
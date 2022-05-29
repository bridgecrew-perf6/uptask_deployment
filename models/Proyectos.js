const Sequelize = require('sequelize'); //importante modulos
const db = require('../config/db'); //Importando configuracion
const slug = require('slug')
const shortid = require('shortid')
//Creando tabla
const Proyectos = db.define('proyecto',{
    id : {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre : {
        type: Sequelize.STRING(100)
    },
    url :{
        type: Sequelize.STRING(100)
    }
    
},{
    hooks:{
        beforeCreate(proyecto){
           const url = slug(proyecto.nombre).toLowerCase();
           proyecto.url = `${url}-${shortid.generate()}`;
        }
    }
});

//Exportando
module.exports = Proyectos;
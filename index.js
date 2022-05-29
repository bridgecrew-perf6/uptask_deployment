//import express from "express";  
const express = require('express');//importante library express
const routes = require('./routes');//importando de la carpeta routes
const path = require('path')
const BodyParser = require('body-parser')
const flash = require('connect-flash')
const session = require('express-session')
const cookieParser = require('cookie-parser')
const passport = require('./config/passport')

//helpers con algunas funciones
const helpers = require('./helpers')


//Importanto valiables.env
require('dotenv').config({path: 'variables.env'})



//┌─────◦(Creando la connexion  a la base de datos)◦─────┐
const db = require('./config/db')
//Importar Modelo
require('./models/Proyectos')
require('./models/Tareas')
require('./models/Usuarios')


db.sync() //authenticate
    .then(()=> console.log('Conectado a la db'))
    .catch((error)=> console.log('Error'))



//┌──────────────◦(Creamos el servidor)◦────────────────┐
//Creando app de Express
const app = express(); 

//Donde cargar archivos statics
app.use(express.static('public'));

//Habilitar pug
app.set('view engine','pug');

//Habilitar BodyParser para leer datos del formulario
app.use(BodyParser.urlencoded({extended: true}))

//Añadir carpeta de las vistas
app.set('views',path.join(__dirname,'./views'))

//Agregar flash messages
app.use(flash())

app.use(cookieParser());

//Sessiones nos permiten nevegar entre distintas paginas sin volvernos autenticas
app.use(session({
    secret: 'supersecreto',
    resave: false,
    saveUninitialized: false
}))

app.use(passport.initialize())
app.use(passport.session())

//pasar vam dum a la application
app.use((req,res,next)=>{
    //console.log(req.user)
    res.locals.vardump = helpers.vardump;
    res.locals.mensajes = req.flash();
    res.locals.usuario= {...req.user} || null
    next();
})
//Importando de routes
app.use('/',routes())


//Servidor y puerto
const host = process.env.HOST || '0.0.0.0';
const port = process.env.PORT || 3000;


app.listen(port,host,()=>{
    console.log('EL servidor esta funcionado')
})

const passport = require('passport');
const LocalsStragy = require('passport-local').Strategy;


//Refrencia al modelo donde vamos a itenticas
const Usuarios = require('../models/Usuarios');

//Local stragy - login con credenciales propias (user - passwors)
passport.use(
    new LocalsStragy(
        //por defaul password esperar usuario y password 
        {
            usernameField: 'email',
            passwordField:'password'
        },
        async (email,password,done)=>{
            try {
                const usuario = await Usuarios.findOne({
                    where:{ email:email,activo: 1}
                });
                //El usuario existe , pero password incorrecto
                if(!usuario.verificarPassword(password)){
                    return done(null,false,{
                        message:'El password incorreto'
                    })
                }
                //El email existe y el password incorrecto
                return done(null,usuario);

            } catch (error) {
                //ESe usuario no existe
                return done(null,false,{
                    message:'Esa cuenta no existe'
                })
            }
        }
    )
);
//desializar el usuario
passport.serializeUser((usuario,callback)=>{
    callback(null,usuario);
})
//desiarlizar al usuario
passport.deserializeUser((usuario,callback)=>{
    callback(null,usuario);
})
//exportar
module.exports = passport;
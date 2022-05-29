const passport = require('passport');
const Usuarios = require('../models/Usuarios')
const crypto = require('crypto');
//const { Sequelize } = require('sequelize/types');
//Importante los operadores
const Sequelize = require('sequelize')
const Op = Sequelize.Op 

const enviarEmail = require('../handlers/email')

//hash pasword nuevo
const bcrypt = require('bcrypt-nodejs');
const { render } = require('pug');


exports.autenticarUsuario = passport.authenticate('local',{
    successRedirect:'/',
    failureRedirect:'/iniciar-sesion',
    failureFlash: true,
    badRequestMessage: 'Ambos campos son obligatorios'
})

//funcion para revisar si el usuario esta logueado o no
exports.usuarioAutenticado = (req,res,next)=>{
    // Si el usuaro esta autenticado , adelante
    if(req.isAuthenticated()){
        return next()
    }
    //sino esta autenticado redirigiar al formularoio
    return res.redirect('/iniciar-sesion')
}
//Funcion para cerrar sesion
exports.cerrarSesion = (req,res)=>{ 
    req.session.destroy(()=>{
        res.redirect('/iniciar-sesion')
    })
}

//Genera un token si el usuario es valido
exports.enviarToken = async(req,res,next)=>{
    //Veridicar que el usuarioe exista
    const usuario  = await Usuarios.findOne({where:{email: req.body.email}})
    //sino existe el usuario
    if(!usuario){
        req.flash('error','NO esiste esa cuenta')
        res.redirect('/reestablecer')
    }
    //Usuario existe
     usuario.token = crypto.randomBytes(20).toString('hex')
    //Genera Expiracion
    usuario.expiracion = Date.now() + 3600000;

    //Guardar en la base de datos
    await usuario.save();

    //URL de reset
    const resetURL = `http://${req.headers.host}/reestablecer/${usuario.token}`
    console.log(resetURL)
    //Enviar el correo con el token
    await enviarEmail.enviar({
        usuario,
        subject: 'Password Reset',
        resetURL,
        archivo:'reestablecer-password'
    })
    
    //terminal envio
    req.flash('correcto','Se envio un mensaje a tu correo')
    res.redirect('/iniciar-sesion')
    
}

//Valida el token genetado
exports.validarToken = async(req,res)=>{
    //res.json(req.params.token)
    const usuario = await Usuarios.findOne({
        where:{
            token: req.params.token
        }
    })
    //Sino encuentra al usuario
    if(!usuario){
        req.flash('error','No Valido')
        res.redirect('/reestablecer')
    }
    //Formulario para generar nueva contraseña
    res.render('resetPassword',{
        nombrePagina: 'Reestablecer Contraseña'
    })
    console.log('usuario')
}

//Actualiza el password
exports.actuliazarPassword = async(req,res)=>{
    // console.log(req.params.token)
    //Verifica el token y la fecha de expiracion
    const usuario = await Usuarios.findOne({
        where: {
            token: req.params.token,
            expiracion: {
                [Op.gte] : Date.now()
            }
        }
    })
    //si  no pasa

    if(!usuario){
        req.flash('error','No valido')
        res.redirect('/reestablecer')
    }
    //si Pasa
    usuario.password = bcrypt.hashSync(req.body.password,bcrypt.genSaltSync(10));
    //borra los campos 
    usuario.token = null
    usuario.expiracion = null

    //guardemos el password
    await usuario.save()
    req.flash('correcto','Se cambio correctamente')
    res.redirect('/iniciar-sesion')

}


const Usuarios = require('../models/Usuarios')
const enviarEmail = require('../handlers/email')

exports.formCrearCuenta = (req,res)=>{
    res.render('crearCuenta',{
        nombrePagina: "Crear cuenta en Uptask"
    })

}
exports.formIniciarSesion = (req,res)=>{
   const {error}= res.locals.mensajes
    res.render('iniciarSesion',{
        nombrePagina: "Inicia session en Uptask",
        error 
    })
}


exports.crearCuenta = async(req,res)=>{
   
    //Leer los datos
    const {email,password} = req.body
    try {
        await  Usuarios.create({
            email,
          password
       });
       //Crear una URL de confirmar
       const confirmarURL = `http://${req.headers.host}/confirmar/${email}`
       //Crear el objeto de usuario
        const usuario ={
            email
        }
    //Enviar email
    await enviarEmail.enviar({
        usuario,
        subject: 'Confirma tu cuenta',
        confirmarURL,
        archivo:'confirmar-cuenta'
    })
    //Redigir al usuario
    req.flash('correcto','Enviarmos un correo confirma tu cuenta')
    res.redirect('/iniciar-sesion')


    } catch (error) {
        //enviando errores a la vista
        req.flash('error',error.errors.map(error => error.message));
        res.render('crearCuenta',{
            mensajes: req.flash() ,
            nombrePagina: "Crear cuenta en Uptask",
            email: email,
            password
        })
    }


}

exports.restablecerPassword =(req,res)=>{
    res.render('reestablecer',{
        nombrePagina: 'Restablecer tu Contraseña'
    })
}


//Verificar Correo
exports.confirmarCorreo = async (req,res)=>{
    const usuario = await Usuarios.findOne({
        where:{ 
            email: req.params.correo
        }
    })
    if(!usuario){
        req.flash('error','No Valido')
        res.redirect('/crear-cuenta')
    }
    usuario.activo = 1;
    await usuario.save();
    req.flash('correcto','Cuenta Activada Correctamente')
    res.redirect('/iniciar-sesion')
}
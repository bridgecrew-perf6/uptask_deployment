const express = require('express'); //importar libreria express
const router = express.Router(); //importat route de exmpress
//importat express validator y agregando al route
const {body} = require('express-validator/check')

//importando controlador
const proyectosContoller = require('../controllers/proyectosController')
const tareasController = require('../controllers/tareasController')
const usuariosController = require('../controllers/usuariosController')
const authController = require('../controllers/authContaoller')



module.exports= function(){ //exportando

    //Creando ruta
    router.get('/',

        authController.usuarioAutenticado,
        proyectosContoller.proyectosHoma
    );
    router.get('/nuevo-proyecto',

    authController.usuarioAutenticado,
    proyectosContoller.formularioProyecto

    );

    router.post('/nuevo-proyecto',
        authController.usuarioAutenticado,
        body('nombre').not().isEmpty().trim().escape() ,
        proyectosContoller.nuevoProyecto);

    //Listar Proyecto
    router.get('/proyectos/:nombreUrl',
        authController.usuarioAutenticado,
        proyectosContoller.proyectosURL
        );

    //Actualizar el proyecto
    router.get('/proyecto/editar/:id',
        authController.usuarioAutenticado,    
        proyectosContoller.formularioEditar)
    router.post('/nuevo-proyecto/:id',
        authController.usuarioAutenticado,
        body('nombre').not().isEmpty().trim().escape() ,
        proyectosContoller.actulizarProyecto);
    //Eliminar Proyecto
    router.delete('/proyectos/:url',
    authController.usuarioAutenticado,
        proyectosContoller.eliminarProyecto)

    //Tareas
    router.post('/proyectos/:url',
        authController.usuarioAutenticado,
        tareasController.agregarTarea)
    //Acutlizar tarea
    router.patch('/tareas/:id',
        authController.usuarioAutenticado,
        tareasController.cambiarEstadoTarea)
    //Eliminar tarea
    router.delete('/tareas/:id',
        authController.usuarioAutenticado,
        tareasController.eliminarTarea)

    //Crear nueva cuenta
    router.get('/crear-cuenta',usuariosController.formCrearCuenta)
    router.post('/crear-cuenta',usuariosController.crearCuenta)

    //Iniciar Session
    router.get('/iniciar-sesion',usuariosController.formIniciarSesion);
    router.post('/iniciar-sesion',authController.autenticarUsuario)

    //Cerrar Sesion
    router.get('/cerrar-sesion',authController.cerrarSesion)


    //Restablecer contraseña
    router.get('/reestablecer',usuariosController.restablecerPassword)
    router.post('/reestablecer',authController.enviarToken);

    router.get('/reestablecer/:token',authController.validarToken)
    router.post('/reestablecer/:token',authController.actuliazarPassword)

    //Verificar cuenta
    router.get('/confirmar/:correo',usuariosController.confirmarCorreo)

    return router

}
const Proyectos = require('../models/Proyectos')
const Tareas = require('../models/Tareas')

exports.proyectosHoma = async(req,res)=>{

    const usuarioId = res.locals.usuario.id
    const proyectosCreados = await Proyectos.findAll({ where:{usuarioId}}); //Nos trae todos

    res.render('index',{
        nombrePagina: 'Proyectos',
        proyectosCreados
    });
}

exports.formularioProyecto= async(req,res)=>{
    const usuarioId = res.locals.usuario.id
    const proyectosCreados = await Proyectos.findAll({
        where:{
            usuarioId: usuarioId
        }
    }); //Nos trae todos
    res.render('nuevoProyecto',{
        nombrePagina: 'Nuevo Proyecto',
        proyectosCreados

    })
}
exports.nuevoProyecto=async(req,res)=>{
    //Enviar a la consola lo que el usuario escriba
    //console.log(req.body);
    //Validad el campo nombré del formulario
    const usuarioId = res.locals.usuario.id
    const proyectosCreados = await Proyectos.findAll({
        where:{
            usuarioId: usuarioId
        }
    });
    const { nombre } = req.body;
    let errores = [];

    if(!nombre){
        errores.push({'texto':'Agrega un Nombbre del Proyecto'})
    }

    //si hay errores
    if(errores.length> 0){
        res.render('nuevoProyecto',{
            nombrePagina: 'Nuevo Proyecto',
            errores
        })
    }else{
        //Si no hay errores
        //Insertar en al DB
        //Enviando nombre y url para su insersion
        const usuarioId = res.locals.usuario.id
        const proyecto = await Proyectos.create({ nombre, usuarioId});

        res.redirect('/')
    }
}
exports.proyectosURL =async (req,res,next)=>{

    const usuarioId = res.locals.usuario.id
    const proyectosPromise = Proyectos.findAll({
        where:{
            usuarioId: usuarioId
        }
    });

    const proyectoPromise =  Proyectos.findOne({
        where:{
            url: req.params.nombreUrl, //del router id
            usuarioId
        }
    });
    const [proyectosCreados,proyecto]=await Promise.all([proyectosPromise,proyectoPromise])
    //Consultar tareas del proyecto actual
    const tareas = await  Tareas.findAll({
        where:{
            proyectoId: proyecto.id
        }
    })

    //Si la url no existe que no se ejecute
    if(!proyecto) return next()
    //console.log(proyecto)

    //render a la vista
    res.render('tareas',{
        nombrePagina : 'Tareas del proyecto',
        proyecto,
        proyectosCreados,
        tareas
    })
}
exports.formularioEditar =async (req,res)=>{
    const usuarioId = res.locals.usuario.id
    const proyectosPromise = Proyectos.findAll({
        where:{
            usuarioId: usuarioId
        }
    }); 
    const proyectoPromise =  Proyectos.findOne({
        where:{
            id: req.params.id, //del router id
            usuarioId
        }
    });
    const [proyectosCreados,proyecto]=await Promise.all([proyectosPromise,proyectoPromise])

    //Render a al vista
    res.render('nuevoProyecto',{
        nombrePagina: 'Editar Proyecto',
        proyectosCreados,
        proyecto
    })
}
exports.actulizarProyecto= async(req,res)=>{
    //Enviar a la consola lo que el usuario escriba
    //console.log(req.body);
    //Validad el campo nombré del formulario
    const usuarioId = res.locals.usuario.id
    const proyectosCreados = await Proyectos.findAll({
        where:{
            usuarioId: usuarioId
        }
    }); 
    const { nombre } = req.body;
    let errores = [];

    if(!nombre){
        errores.push({'texto':'Agrega un Nombbre del Proyecto'})
    }

    //si hay errores
    if(errores.length> 0){
        res.render('nuevoProyecto',{
            nombrePagina: 'Nuevo Proyecto',
            errores
        })
    }else{
        //Si no hay errores
        //actualizar en al DB
        await Proyectos.update(
            { nombre: nombre },
            {where: { id: req.params.id }}
        );

        res.redirect('/')
    }
}
exports.eliminarProyecto = async (req,res,next)=>{
    const {urlProyecto} = req.query
    const resultado = await Proyectos.destroy({where:{url: urlProyecto}});
    if(!resultado){
        return next();
    }
    res.status(200).send('Proyecto Eliminado Correctamente')
}
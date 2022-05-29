const Proyectos = require('../models/Proyectos')
const Tareas = require('../models/Tareas')
exports.agregarTarea = async (req,res,next)=>{
    //console.log(req.params.url) //url viene del route
    //Obtenemos el proyecto actual
    const proyecto = await Proyectos.findOne({where: {url: req.params.url}});

    //Leer el valor del input
    const {tarea} = req.body;
    //Estado
    const estado = 0;
    //Id del proyecto
    const proyectoId = proyecto.id;
    //Insertar db en orden
    const resultado  = await Tareas.create({ tarea,estado,proyectoId})
    if(!resultado){
        return next();
    }
    //redireccionar
    res.redirect(`/proyectos/${req.params.url}`)
}

exports.cambiarEstadoTarea =async (req,res,next)=>{
    const {id} = req.params;
    const tarea = await Tareas.findOne({where:{ id : id }})
    //Cambiar estado
    let estado = 0;
    if(tarea.estado === estado){
        estado = 1
    }
    tarea.estado= estado
    const resultado = await  tarea.save();
    if(!resultado) return next();

    res.status(200).send('Actualizado')
}
exports.eliminarTarea = async (req,res,next)=>{
    const {id} = req.params
    //eliminar tarea
    const resultado = await Tareas.destroy({where:{
        id: id
        }})
    if(!resultado) return next()
    res.status(200).send('Tarea Eliminada')
}
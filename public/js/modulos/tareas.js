import axios from "axios";
import Swal from "sweetalert2";
import {actualizarAvance} from '../funciones/avance';

const tareas = document.querySelector('.listado-pendientes')
if(tareas){
    tareas.addEventListener('click',(e)=>{
        if(e.target.classList.contains('fa-check-circle')){
            const icono =e.target
            const idTarea = icono.parentElement.parentElement.dataset.tarea;// Accediendo a la id

            const url =`${location.origin}/tareas/${idTarea}`
            axios.patch(url,{idTarea})
                .then(function (respuesta){
                    if(respuesta.status === 200){
                        icono.classList.toggle('completo')
                        actualizarAvance(); //barra
                    }
                })
        }
        if(e.target.classList.contains('fa-trash')){
            const tareaHTML = e.target.parentElement.parentElement,
                idTarea = tareaHTML.dataset.tarea;
            Swal.fire({
                title: 'Desea Borrar esta tarea?',
                text: "Una Tarea eliminada no se puede eliminar!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, delete it!'
            }).then((result) => {
                if (result.isConfirmed) {
                    const url =`${location.origin}/tareas/${idTarea}`
                    //Enviar a axios
                    axios.delete(url,{params: {idTarea}})
                        .then(function (respuesata){
                            if(respuesata.status === 200){
                                //Eliminar nodo
                                tareaHTML.parentElement.removeChild(tareaHTML);
                                //opcional alerta
                                Swal.fire(
                                    respuesata.data,
                                    'success'
                                )
                                actualizarAvance(); //barra
                            }
                        })


                }
            })

        }
    })
}

export default tareas;
import Swal from "sweetalert2";

export const actualizarAvance = ()=>{
    //SElecionar las tareas existentes
    const tareas = document.querySelectorAll('li.tarea');
    if(tareas.length){

        // Selecionar las tareascompletadas
            const tareasCompletas = document.querySelectorAll('i.completo')
        // Calcular el avance
        const avance = Math.round((tareasCompletas.length/  tareas.length)* 100);
          // Mostrar el avance
            const porcentaje = document.querySelector('#porcentaje')
        porcentaje.style.width = avance+"%"
        if(avance ===100){
            Swal.fire(
                'Good job!',
                'You clicked the button!',
                'success'
            )
        }
    }
}
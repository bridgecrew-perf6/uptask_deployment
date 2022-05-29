import Swal from 'sweetalert2';
import axios from "axios";

const btnEliminar = document.querySelector('#eliminar-proyecto');
if(btnEliminar){

    btnEliminar.addEventListener('click',(e)=>{
        const urlProyecto = e.target.dataset.proyectoUrl;
        //console.log(urlProyecto)

        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                //Enviar petition a axios
                const url = `${location.origin}/proyectos/${urlProyecto}`;

                axios.delete(url,{params: {urlProyecto}})
                    .then(function (respuesta){
                        //console.log(respuesta)
                        Swal.fire(
                            'Deleted!',
                            respuesta.data,
                            'success'
                        )
                        setTimeout(()=>{
                            window.location.href = '/'
                        },2000)
                    })
                    .catch(()=>{
                        Swal.fire({
                            icon: 'error',
                            title: 'Oops...',
                            text: 'Something went wrong!',
                            footer: '<a href="">Why do I have this issue?</a>'
                        })
                    })


            }
        })
    })

}
export default btnEliminar

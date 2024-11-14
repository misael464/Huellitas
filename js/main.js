//Selectores 
const pacienteInput = document.querySelector('#paciente');
const propietarioInput = document.querySelector('#propietario');
const emailInput = document.querySelector('#email');
const fechaInput = document.querySelector('#fecha');
const sintomasInput = document.querySelector('#sintomas');

const formulario = document.querySelector('#formulario-cita')
const contenedorCitas = document.querySelector('#citas')


// Eventos
pacienteInput.addEventListener('change', datosCitas);
propietarioInput.addEventListener('change', datosCitas);
emailInput.addEventListener('change', datosCitas);
fechaInput.addEventListener('change', datosCitas);
sintomasInput.addEventListener('change', datosCitas);

formulario.addEventListener('submit', submitCita);
let editando = false;

//Objeto de cita
const citaObj = {
    id: generarId(),
    paciente:'',
    propietario:'',
    email:'',
    fecha:'',
    sintomas:''
}

// Clases
class Notificacion{
    constructor({texto, tipo}){
        this.texto = texto;
        this.tipo = tipo;

        this.mostrar();
    }

    mostrar(){
        // crear la notificacion
        const alerta = document.createElement('DIV')
        alerta.classList.add('div-alert');

        // Eliminar alertas duplicadas
        const alertaPrevia = document.querySelector('.div-alert')
        if (alertaPrevia){
            alertaPrevia.remove();
        }

        // si es de tipo error, se agrega una clase
        this.tipo === 'error' ? alerta.classList.add('alert-red') : alerta.classList.add('alert-green')

        //mensaje de error
        alerta.textContent = this.texto;

        //insertar en el DOM
        formulario.parentElement.insertBefore(alerta, formulario);

        // Quitar alerta despues de 3s
        setTimeout(()=>{
            alerta.remove()
        }, 3000);
    }
}



class AdminCitas{
    constructor(){
        this.citas = [];
    }

    agregar(cita){
        this.citas = [...this.citas, cita]
        this.mostrar();
    }
    editar(citaActuaLizada){
        this.citas = this.citas.map(cita => cita.id === citaActuaLizada.id ? citaActuaLizada : cita)
        this.mostrar();
    }
    eliminar(id){
        this.citas = this.citas.filter(cita =>cita.id !==id)
        this.mostrar();
    }

    mostrar(){
        //limpiar el html
        while (contenedorCitas.firstChild) {
            contenedorCitas.removeChild(contenedorCitas.firstChild);
        }

        //si no hay citas
        if (this.citas.length=== 0) {
            contenedorCitas.innerHTML = '<p class="no-paciente">No Hay Pacientes</p>'
            return;
        }
        //generando
        this.citas.forEach((cita) =>{
            const divCitas = document.createElement('DIV');
            divCitas.classList.add('div-citas')

            const paciente = document.createElement('p');
            paciente.classList.add('clase-paciente');
            paciente.innerHTML = `<span class="span-bold">Paciente: </span> ${cita.paciente}`

            const propietario = document.createElement('p');
            propietario.classList.add('clase-paciente');
            propietario.innerHTML = `<span class="span-bold">Propietario: </span> ${cita.propietario}`

            const email = document.createElement('p');
            email.classList.add('clase-paciente');
            email.innerHTML = `<span class="span-bold">E-mail: </span> ${cita.email}`

            const fecha = document.createElement('p');
            fecha.classList.add('clase-paciente');
            fecha.innerHTML = `<span class="span-bold">Fecha: </span> ${cita.fecha}`

            const sintomas = document.createElement('p');
            sintomas.classList.add('clase-paciente');
            sintomas.innerHTML = `<span class="span-bold">Sintomas: </span> ${cita.sintomas}`

            //BTN DE ELIMINAR Y EDITAR
            const btnEditar = document.createElement('button');
            btnEditar.classList.add('btn-edit')
            btnEditar.innerHTML = 'Editar'
            const clone = {...cita};
            btnEditar.onclick = () =>cargarEdicion(clone);

            const btnEliminar = document.createElement('button');
            btnEliminar.classList.add('btn-clear')
            btnEliminar.innerHTML = 'Eliminar';
            btnEliminar.onclick = () => this.eliminar(cita.id);

            //para mostrar pantalla
            const contenedorBotones = document.createElement('DIV')
            contenedorBotones.classList.add('flex-btn');

            contenedorBotones.appendChild(btnEditar);
            contenedorBotones.appendChild(btnEliminar);

            //agregando al html
            divCitas.appendChild(paciente);
            divCitas.appendChild(propietario);
            divCitas.appendChild(email);
            divCitas.appendChild(fecha);
            divCitas.appendChild(sintomas);
            divCitas.appendChild(contenedorBotones);
            contenedorCitas.appendChild(divCitas);
        })
    }
}



function datosCitas(e) {
    citaObj[e.target.name] = e.target.value;
}
const citas = new AdminCitas()

function submitCita(e){
    e.preventDefault();

    if(Object.values(citaObj).some(valor => valor.trim()==='')){
    const notificacion = new Notificacion({
        texto: 'todos los campos son obligatorio',
        tipo: 'error'
    });
    return;

    }

    if (editando) {
        citas.editar({...citaObj });
        new Notificacion({
            texto: 'Guardado Correctamente',
            tipo: 'exito'
        });
        editando = false;
    }else{
        citas.agregar({...citaObj });
        new Notificacion({
            texto: 'paciente Registrado',
            tipo: 'exito'
        })
    }

    
    formulario.reset();
    reiniciarObjetoCita();
    
    
}



function reiniciarObjetoCita() {
    citaObj.id = generarId();
    citaObj.paciente = '';
    citaObj.propietario = '';
    citaObj.email = '';
    citaObj.fecha = '';
    citaObj.sintomas = '';
}

function cargarEdicion(cita) {
    Object.assign(citaObj, {...cita});

    pacienteInput.value = cita.paciente;
    propietarioInput.value = cita.propietario;
    emailInput.value = cita.email;
    fechaInput.value = cita.fecha;
    sintomasInput.value = cita.sintomas;

    editando = true
}
function generarId() {
    return Math.random().toString(36).substring(2) + Date.now();
}
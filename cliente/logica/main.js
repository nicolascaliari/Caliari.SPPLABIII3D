import { tipos } from './tipos.js';
import { tiposFiltro } from './tipoFiltro.js';
import { Monstruo } from './clases/monstruos.js';
import { CrearTabla, ModificarTabla } from './tabla.js';
const URL = 'http://localhost:3000/monstruos';
import axios from 'https://cdn.jsdelivr.net/npm/axios@1.3.5/+esm';
const form = document.getElementById('fr');
const tabla = document.getElementById('tTabla');

let array = [];
let id = 0;
const storedData = localStorage.getItem('monstruos');
if (storedData) {
    array = JSON.parse(storedData);
}

tabla.appendChild(CrearTabla(array));

window.addEventListener('DOMContentLoaded', () => {
    traerTodo();
    const select = document.querySelector('#tipos');
    tipos.forEach(tipo => {
        const option = document.createElement('option');
        option.value = tipo;
        option.textContent = tipo;
        select.appendChild(option);
    });


    const selectFiltro = document.getElementById('filtro');
    selectFiltro.addEventListener('change', filtrar)
    tiposFiltro.forEach(tiposFiltro => {
        const option = document.createElement('option');
        option.value = tiposFiltro;
        option.textContent = tiposFiltro;
        selectFiltro.appendChild(option);
    })

    promedioMiedo(array);


    form.guardar.addEventListener('click', Alta);
    form.modificar.addEventListener('click', Modificar);
    form.borrar.addEventListener('click', eliminar);
    form.cancelar.addEventListener('click', cancelar);
});



tabla.addEventListener('click', (event) => {
    if (event.target.matches('td')) {
        const indice = event.target.parentElement.dataset.id;
        const seleccionado = array.find((x) => x.id == indice);

        id = indice;

        document.getElementById('nombre').value = seleccionado.nombre;
        document.getElementById('alias').value = seleccionado.alias;
        document.getElementById('miedo').value = seleccionado.miedo;
        document.getElementById('tipos').value = seleccionado.tipo;


        const defensaSeleccionada = seleccionado.defensa;
        const defensaRadios = document.getElementsByName('defensa');
        for (let radio of defensaRadios) {
            if (radio.value === defensaSeleccionada) {
                radio.checked = true;
            }
        }

        const botones = document.querySelectorAll('#borrar, #cancelar, #modificar');
        const botonGuardar = document.getElementById('guardar');

        for (let boton of botones) {
            boton.style.display = 'inline-block';
        }

        botonGuardar.style.display = 'none';

    }
});


//funciones extras

const cancelar = () => {
    form.guardar.value = "Guardar";
    form.borrar.disabled = true;
    form.reset();
    id = 0;
    const botones = document.querySelectorAll('#borrar, #cancelar, #modificar');
    const botonGuardar = document.getElementById('guardar');
    for (let boton of botones) {
        boton.style.display = 'none';
    }

    botonGuardar.style.display = 'inline-block';
}



function obtenerUltimoId() {
    return array.length > 0 ? array[array.length - 1].id + 1 : 1;
}

const ordenar = (tabla,elementos) => {
    elementos = array.sort((a, b) => {
        return b.miedo - a.miedo;
    });
    console.log(elementos);

    ModificarTabla(tabla, elementos);
}



///////////////// filtrado

const filtrar = () => {
    const filtro = document.getElementById('filtro');
    let elementos = [];

    elementos = array.filter((x) => {
        console.log(array)
        if (filtro.value === "todos" || x.tipo === filtro.value) {
            return true;
        }
    });
    console.log(elementos);

    promedioMiedo(elementos);
    ModificarTabla(tabla, elementos);
}


//funciones crud
const Alta = () => {
    let elemento;
    const nombre = document.getElementById('nombre');
    const alias = document.getElementById('alias');
    const miedo = document.getElementById('miedo');
    const tipo = document.getElementById('tipos');
    const defensaSeleccionada = document.querySelector('input[name="defensa"]:checked');
    let id = obtenerUltimoId();

    if (defensaSeleccionada) {
        elemento = defensaSeleccionada.value;
    } else {
        console.log('no hay nada seleccionado');
    }
    const monstruo = new Monstruo(id, nombre.value, tipo.value, miedo.value, elemento, alias.value);

    const xhr = new XMLHttpRequest();
    xhr.addEventListener("readystatechange", () => {
        if (xhr.readyState == 4) {
        }
    });
    xhr.open("POST", URL)
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

    xhr.send(JSON.stringify(monstruo));

    ModificarTabla(tabla, array);
}




//funcion para traer todos los monstruos
const traerTodo = async () => {
    try {
        let data = await fetch(URL)
        let array = await data.json()
        console.log(array)
        localStorage.setItem('monstruos', JSON.stringify(array));
        
        ordenar(tabla,array);
        //ModificarTabla(tabla, array);
    } catch (error) {
        console.error(error)
    }
}



const Modificar = async () => {
    const monstruo = array.find((x) => {
        if (x.id == id) {
            x.nombre = document.getElementById('nombre').value;
            x.alias = document.getElementById('alias').value;
            x.miedo = document.getElementById('miedo').value;
            x.tipo = document.getElementById('tipos').value;
            const defensa = document.getElementsByName('defensa');
            let elemento;

            defensa.forEach((e) => {
                if (e.checked) {
                    elemento = e.value;
                }
            });

            x.defensa = elemento;
            return x;
        }
    });

    const xhr = new XMLHttpRequest();
    xhr.addEventListener("readystatechange", () => {
        if (xhr.readyState == 4) {
        }
    });
    xhr.open("PUT", URL + "/" + monstruo.id)
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

    xhr.send(JSON.stringify(monstruo));

    ModificarTabla(tabla, array);
}


const eliminar = async () => {
    try {
        const response = await axios.delete(`${URL}/${id}`);

        if (response.status >= 200 && response.status < 300) {
            lista = response.data;
            console.log(lista);
            ModificarTabla(tabla, lista);
        } else {
            console.error("Error: " + response.status + "-" + response.statusText);
        }
        spinner.classList.add("oculto");
    } catch (error) {
        console.error("Error al realizar la solicitud:", error);
    }
};





const checkboxes = document.querySelectorAll('#contenedor input[type="checkbox"]');
checkboxes.forEach(e => { e.addEventListener('change', filtrarAtributos) });

function filtrarAtributos() {
    const checkboxes = document.querySelectorAll('#contenedor input[type="checkbox"]');
    let checks = [];
    let atributosSeleccionados = Array.from(checkboxes)
        .filter(checkbox => {
            checks.push(checkbox.checked);
            return checkbox.checked
        })
        .map(checkbox => checkbox.name);
    if (!atributosSeleccionados.includes('id')) {
        let array = [];
        array.push('id');
        atributosSeleccionados.forEach(e => { array.push(e); });
        atributosSeleccionados = array;
    }

    const resultado = array.map(obj => {
        const nuevoObjeto = {};
        atributosSeleccionados.forEach(atributo => {
            nuevoObjeto[atributo] = obj[atributo];
        });
        return nuevoObjeto;
    });
    ModificarTabla(tabla, resultado);
    localStorage.setItem("checkboxes", JSON.stringify(checks));
}



const promedioMiedo = (elemento) => {
    let miedo = elemento.map(e => parseInt(e.miedo));

    var miedoTotal = miedo.reduce(function (total, miedo) {
        return parseInt(total + miedo);
    }, 0);

    const txt = document.getElementById("promedioMiedo");

    const promedio = miedoTotal / elemento.length;
    const promedioRedondeado = promedio.toFixed(2);

    if(promedioRedondeado == "NaN"){
        txt.value = 0;
        return;
    }
    txt.value = promedioRedondeado;

    console.log(promedioRedondeado);
}


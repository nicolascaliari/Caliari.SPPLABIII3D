
const monstruos = JSON.parse(localStorage.getItem('monstruos')) || [];

window.addEventListener('DOMContentLoaded', Generar);

function Generar() {
    const formulario= document.getElementById('fr');

    monstruos.forEach((monstruo) => {
        const ficha= document.createElement('fieldset');

        const nombre= document.createElement('label');
        const tipo= document.createElement('label');
        const miedo= document.createElement('label');
        const defensa= document.createElement('label');
        const alias= document.createElement('label');


        nombre.textContent = "nombre: " + monstruo.nombre;
        tipo.textContent = "Alias: " + monstruo.tipo;
        miedo.textContent ="Editorial: " + monstruo.miedo;
        defensa.textContent= "Fuerza:  " + monstruo.defensa;
        alias.textContent = "Arma: " + monstruo.alias;



        ficha.appendChild(nombre);
        ficha.appendChild(tipo);
        ficha.appendChild(miedo);
        ficha.appendChild(defensa);
        ficha.appendChild(alias);

        formulario.appendChild(ficha);

    })
}
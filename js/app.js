
const container = document.querySelector('.container');
const resultado = document.querySelector('#resultado');
const formulario = document.querySelector('#formulario');
const selectPaises = document.querySelector('#pais');
let listaPaises = [];
let paisesNombres;

window.addEventListener('load', () => {
    formulario.addEventListener('submit', buscarClima);
    obtenerTodosLosPaices();


});

function agregarBandera(codigo) {
    //Agregar al HTML la bandera
    insertarBanderaHTML(codigo, listaPaises);
}

function insertarBanderaHTML(e, paises) {


    const imgBandera = document.createElement('img');

    paises.forEach(pais => {
        if (e === pais.codigo) {
            imgBandera.src = pais.bandera;
        }
    });

    imgBandera.className = 'w-64 h-32 mt-0 mb-0 mr-auto ml-auto';
    resultado.appendChild(imgBandera);
}
function cargarSelectPaises(paises) {

    paises.forEach(pais => {


        const { cca2, name, flags: { svg } } = pais;
        // console.log(cca2); Ya tengo el codigo de pais
        // console.log(name); este me trae el objeto name
        paisesNombres = obtenerNombrePais(name);//Aqui mando a consultar el nombre oficial
        // console.log(paisesNombres); Ya tengo el nombre oficial

        llenarSelectPaises(cca2, paisesNombres, svg);//Llenando Select
    });
    ordenarArray(listaPaises);
}

function obtenerNombrePais({ common }) {
    return common;

}

function llenarSelectPaises(codigo, nombre, bandera) {

    let nuevoPaises = {};
    nuevoPaises = { ...nuevoPaises, codigo, nombre, bandera };//llena el objeto
    listaPaises.push(nuevoPaises);//llena el array de listaPaises los objetos

}

function ordenarArray(paises) {

    let nuevaListaOrdenada = paises.sort((a, b) => a.nombre.localeCompare(b.nombre));
    // console.log(nuevaListaOrdenada);
    nuevaListaOrdenada.forEach(pais => {
        const { nombre, codigo } = pais;
        // console.log(nombre);

        const option = document.createElement('option');
        option.value = codigo;
        option.textContent = nombre;
        selectPaises.appendChild(option);
    });
}
function buscarClima(e) {
    e.preventDefault();

    //Validar ciudad, pais
    const ciudad = document.querySelector('#ciudad').value;
    const pais = document.querySelector('#pais').value;


    if (ciudad === '' || pais === '') {
        mostrarAlerta('Los dos campos Ciudad y Pais son obligatorios', 'error');

        return;
    }

    //Consultamos la API
    consultarAPI(ciudad, pais);

}
function consultarAPI(ciudad, pais) {
    const appId = '3f97b19285c7d975fe7dd36b4dbff842';
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${ciudad},{state code},${pais}&appid=${appId}`;

    //Muestra un spinner de carga
    spinner();

    fetch(url)
        .then(resultado => resultado.json())
        .then(datos => {
            limpiarHTML();
            agregarBandera(selectPaises.value);
            if (datos.cod === "404") {
                mostrarAlerta('Ciudad no encontrada', 'error')
            } else {
                //Imprime la respuesta en HTML;
                mostrarClima(datos);
            }
        });
}
function mostrarAlerta(mensaje, tipo) {
    const alerta = document.querySelector('.bg-red-200');
    if (!alerta) {
        const mensajeAlerta = document.createElement('p');

        if (tipo === 'error') {
            mensajeAlerta.classList.add('bg-red-200', 'p-6', 'border-2', 'border-red-500', 'text-red-600', 'text-center', 'rounded');
            mensajeAlerta.innerHTML = mensaje;
            formulario.parentElement.insertBefore(mensajeAlerta, formulario);
        }
        setTimeout(() => {
            mensajeAlerta.remove();
        }, 3000);
    }



}
function obtenerTodosLosPaices() {
    fetch('https://restcountries.com/v3.1/all')
        .then(resultado => resultado.json())
        .then(paises => cargarSelectPaises(paises));
}

function mostrarClima(datos) {
    console.log(datos);
    const { name, main: { temp, temp_max, temp_min } } = datos;

    const centigrados = kelvinACentigrados(temp);
    const maxTemp = kelvinACentigrados(temp_max);
    const minTemp = kelvinACentigrados(temp_min);

    const ciudad = document.createElement('P');
    ciudad.textContent = name;
    ciudad.classList.add('font-bold', 'text-2xl', 'text-center', 'text-white');

    const actual = document.createElement('P');
    actual.innerHTML = `${centigrados} &#8451;`;
    actual.classList.add('font-bold', 'text-6xl', 'text-center', 'text-white');

    const maxTempP = document.createElement('P');
    maxTempP.innerHTML = `Max: ${maxTemp} &#8451;`;
    maxTempP.classList.add('font-bold', 'text-1xl', 'text-center', 'text-white');

    const minTempP = document.createElement('P');
    minTempP.innerHTML = `Min: ${minTemp} &#8451;`;
    minTempP.classList.add('font-bold', 'text-1xl', 'text-center', 'text-white');

    const resultadoDiv = document.createElement('DIV');

    resultado.appendChild(actual);
    resultado.appendChild(ciudad);
    resultado.appendChild(maxTempP);
    resultado.appendChild(minTempP);

    resultado.appendChild(resultadoDiv);
}
function limpiarHTML() {
    while (resultado.firstChild) {
        resultado.removeChild(resultado.firstChild);
    }
}

const kelvinACentigrados = grados => parseInt(grados - 273.15);

function spinner() {
    limpiarHTML();

    const divSpinner = document.createElement('DIV');

    divSpinner.classList.add('sk-fading-circle');

    divSpinner.innerHTML = `
        
    <div class="sk-circle1 sk-circle"></div>
    <div class="sk-circle2 sk-circle"></div>
    <div class="sk-circle3 sk-circle"></div>
    <div class="sk-circle4 sk-circle"></div>
    <div class="sk-circle5 sk-circle"></div>
    <div class="sk-circle6 sk-circle"></div>
    <div class="sk-circle7 sk-circle"></div>
    <div class="sk-circle8 sk-circle"></div>
    <div class="sk-circle9 sk-circle"></div>
    <div class="sk-circle10 sk-circle"></div>
    <div class="sk-circle11 sk-circle"></div>
    <div class="sk-circle12 sk-circle"></div>
        

    `;

    resultado.appendChild(divSpinner);
}
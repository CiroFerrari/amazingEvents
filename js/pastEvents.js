// DECLARACIÓN DE VARIABLES GLOBALES
let divContenedorCards = document.getElementById("mainCards");  
let data;
let contenidoCards = [];
let fechaActual = "";
let inputSearch = document.getElementById('searchInput');
let buttonSearch = document.getElementById('searchButton');
let cardsBuscadas = [];
let checkBoxesActivos = [];
let categoriasFiltradas = [];

// FUNCIÓN ASÍNCRONA QUE OBTIENE DATOS DE API Y EJECUTA EN BASE A ESOS DATOS
getDatafromAPI();
async function getDatafromAPI() {
    await fetch("https://amazing-events.herokuapp.com/api/events")
        .then(response => response.json())
        .then(json => data = json);

// Extraemos los eventos del Objeto "data"
contenidoCards = data.events;
fechaActual = data.currentDate;

// FILTRAR EVENTOS PASADOS DEL TOTAL DE EVENTOS
contenidoCards = eventosPasados(contenidoCards);

// IMPRESIÓN INICIAL DE CARDS Y CHECKBOXES
filtrar();

// FILTRAR POR EVENTO EN CHECKBOX Ó POR EVENTO EN BOTÓN DE BÚSQUEDA
buttonSearch.addEventListener('click', mostrar => filtrar() );
divCheckboxes.addEventListener("click", evento => filtrar() );


// DECLARACIÓN DE FUNCIONES

// Función para filtrar las Cards que se van a mostrar en base a diferentes condiciones del input de búsqueda y los checkboxes
function filtrar () {
    cardsBuscadas = [];
    checkBoxesActivos = [];
    checkActivos();
    let inputValue = inputSearch.value;
    inputValue = inputValue.toLowerCase().trim();
    if ( inputValue == "" && checkBoxesActivos.length == 0 ) {      // Filtra si input de búsqueda y checkboxes están vacíos
        impresionCards(contenidoCards);
        impresionCheckboxes(contenidoCards);
        }
    else if ( inputValue != "" && checkBoxesActivos.length == 0){   // Filtra si input de búsqueda tiene valor y checkboxes están vacíos
        cardsBuscadas = contenidoCards.filter( evento => evento.name.toLowerCase().trim().startsWith(inputValue));
        impresionCards(cardsBuscadas);
        }
    else if ( inputValue == "" && checkBoxesActivos.length != 0){   // Filtra si input de búsqueda está vacío y checkboxes están activos
        for (elemento of checkBoxesActivos){
            for ( let i = 0 ; i < contenidoCards.length ; i++) {
                if(contenidoCards[i].category == elemento) {
                    cardsBuscadas.push(contenidoCards[i]);
                }
            }
        }
        impresionCards(cardsBuscadas);
        }
    else if ( inputValue != "" && checkBoxesActivos.length != 0){   // Filtra si input de búsqueda y checkboxes están activos
        for (elemento of checkBoxesActivos){
            for (let i = 0 ; i < contenidoCards.length ; i++) {
                if(contenidoCards[i].category == elemento) {
                    cardsBuscadas.push(contenidoCards[i]);
                }
            }
        }
        cardsBuscadas = cardsBuscadas.filter( evento => evento.name.toLowerCase().trim().startsWith(inputValue));
        impresionCards(cardsBuscadas);
        }
}

// Función para imprimir las Cards en base a un Array
function impresionCards(arrayImprimir){
    divContenedorCards.innerHTML = "";
    for (let i = 0 ; i < arrayImprimir.length ; i++) {
        let card = document.createElement("div");
        card.innerHTML = `
                        <div class="card my-3 pb-3" style="width: 18rem; height: 28rem;">
                            <img src="${arrayImprimir[i].image}" class="card-img-top" alt="...">
                            <div class="card-body d-flex flex-column justify-content-end">
                                <h4 class="card-title text-center">${arrayImprimir[i].name}</h4>
                                <p class="card-title text-center">${arrayImprimir[i].description}</p>
                                <div class="mt-4 d-flex justify-content-around align-items-center">
                                    <p class="card-text m-0">Precio: ${arrayImprimir[i].price}</p>
                                    <a href="./details.html?id=${arrayImprimir[i]._id}" class="btn a-btn text-light">More Info</a>
                                </div>
                            </div>
                        </div>
                        `   ;
        divContenedorCards.appendChild(card);
    }    
    if(arrayImprimir.length == 0) {
        let mensaje = document.createElement("div");
        mensaje.innerHTML = `<p class="fs-5 text-center mt-5">No results. Please try with another search :)</p>
                        `   ;
        divContenedorCards.appendChild(mensaje);   
    }  
}

// Función para imprimir los checkboxes en base a las categorías de las Cards
function impresionCheckboxes(arrayImprimir) {
    let categorias = arrayImprimir.map( evento => evento.category);
    categoriasFiltradas = categorias.filter( (ele,pos)=>categorias.indexOf(ele) == pos);    // Elimina categorías repetidas

    let divCheckboxes = document.getElementById('divCheckboxes');
    divCheckboxes.textContent = "";
    for ( elemento of categoriasFiltradas ) {
        let checkbox = document.createElement("div");
        checkbox.innerHTML = `<div class="d-flex align-items-center justify-content-center">
                            <label for="${elemento}" class="">${elemento}
                            </label>
                            <input id="${elemento}" class="me-3 ms-1" type="checkbox">
                            </div>
                        `   ;
        divCheckboxes.appendChild(checkbox);
    }   
}

// Función para ver los checkboxes activos
function checkActivos() {
    for(elemento of categoriasFiltradas) {
        let checkbox = document.getElementById(elemento);
        if (checkbox.checked == true ) {
            checkBoxesActivos.push(checkbox.id);
        }
    }
    return checkBoxesActivos;
}

// Función para filtrar los eventos pasados en base a un Array
function eventosPasados(array) {
    let arrayPasado = [];
    for (elemento of array) {
        if(elemento.date < fechaActual) {
            arrayPasado.push(elemento);
        }
    }
    return arrayPasado;
}

}

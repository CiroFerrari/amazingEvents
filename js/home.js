// DECLARACIÓN DE VARIABLES GLOBALES
let divContenedorCards = document.getElementById("mainCards");  
let contenidoCards = data.eventos;
let inputSearch = document.getElementById('searchInput');
let buttonSearch = document.getElementById('searchButton');
let cardsBuscadas = [];
let checkBoxesActivos = [];
let categoriasFiltradas = [];

// CREACIÓN DE ID PARA CADA CARD
contenidoCards = crearID(contenidoCards);

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
        console.log("Cards Buscadas: ")
        console.log(cardsBuscadas)
    }
    else if ( inputValue != "" && checkBoxesActivos.length == 0){   // Filtra si input de búsqueda tiene valor y checkboxes están vacíos
        for ( let i = 0 ; i < contenidoCards.length ; i++) {
            if(contenidoCards[i].name.toLowerCase().trim().startsWith(inputValue)) {
                cardsBuscadas.push(contenidoCards[i]);
            }
        }
        impresionCards(cardsBuscadas);
        console.log("Cards Buscadas: ")
        console.log(cardsBuscadas)
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
        console.log("Cards Buscadas: ")
        console.log(cardsBuscadas)
    }
    else if ( inputValue != "" && checkBoxesActivos.length != 0){   // Filtra si input de búsqueda y checkboxes están activos
        for (elemento of checkBoxesActivos){
            for (let i = 0 ; i < contenidoCards.length ; i++) {
                if(contenidoCards[i].category == elemento) {
                    cardsBuscadas.push(contenidoCards[i]);
                }
            }
        }
        for ( let i = 0 ; i < cardsBuscadas.length ; i++) {
            if(!(cardsBuscadas[i].name.toLowerCase().trim().startsWith(inputValue))) {
                cardsBuscadas.splice(i, 1);
                i--;
            }
        }
        impresionCards(cardsBuscadas);
        console.log("Cards Buscadas: ")
        console.log(cardsBuscadas)
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
                                    <a href="./sections/details.html?id=${i+1}" class="btn a-btn text-light">Ver más</a>
                                </div>
                            </div>
                        </div>
                        `   ;
        divContenedorCards.appendChild(card);
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

function crearID(array) {
    for ( let i = 0; i < array.length ; i++) {
        array[i].id = i+1;
    }
    return array;
}
// DECLARACIÓN DE VARIABLES GLOBALES
let divContenedorCards = document.getElementById("mainCards");  
let data;
let contenidoCards = [];
let fechaActual = "";

// FUNCIÓN ASÍNCRONA QUE OBTIENE DATOS DE API Y EJECUTA EN BASE A ESOS DATOS
getDatafromAPI();
async function getDatafromAPI() {
    await fetch("https://amazing-events.herokuapp.com/api/events")
        .then(response => response.json())
        .then(json => data = json);

// Extraemos los eventos del Objeto "data"
contenidoCards = data.events;
fechaActual = data.currentDate;

// TOMAR LOS DATOS DE LA CARD SELECCIONADA E IMPRIMIRLA EN PANTALLA
tomarDatos();

// DECLARACIÓN DE FUNCIONES

function tomarDatos () {
    let id = location.search.split("?id=");
    let selectedId = String(id[1]);
    let evento = contenidoCards.find( function(evento) {
        return evento._id == selectedId;
    } )
    let assist = assistanceOrEstimate(evento);
    let card = `
                <div class="details--figure d-flex flex-column justify-content-center align-items-center">
                    <img src="${evento.image}" alt="">
                </div>
                <article class="details--article d-flex flex-column justify-content-center align-items-center">
                    <h3 class="details--h3">${evento.name}</h3>
                    <div class="d-flex flex-column">
                        <p>Name: ${evento.name}</p>
                        <p>Date: ${evento.date}</p>
                        <p>Description: ${evento.description}</p>
                        <p>Category: ${evento.category}</p>
                        <p>Place: ${evento.place}</p>
                        <p>Capacity: ${evento.capacity}</p>
                        <p>${assist}</p>
                        <p>Price: $${evento.price}</p>
                    </div>
                </article>
                `;

    document.querySelector("#mainCards").innerHTML = card;
}


// Si el evento futuro imprimirá "Estimate: " y si es pasado imprimirá "Assistance: ". 
function assistanceOrEstimate(evento) {
    let assistEstimate = "";
    if (evento.date > fechaActual) {
        assistEstimate = "Estimate: " + evento.estimate;
    } else {
        assistEstimate = "Assistance: " + evento.assistance;
    }
    return assistEstimate;
}


}





let fechaActual = "2022-02-22";

let fechaX = "2022-02-21";

function fecha (fechaActual, fechaX) {
    let evento = "";
    
    let añoActual = fechaActual[0] + fechaActual[1] + fechaActual[2] + fechaActual[3];
    console.log(añoActual);

    let añoX = fechaX[0] + fechaX[1] + fechaX[2] + fechaX[3];
    console.log(añoX);

    let mesActual = fechaActual[5] + fechaActual[6];
    console.log(mesActual);

    let mesX = fechaX[5] + fechaX[6];
    console.log(mesX);

    let diaActual = fechaActual[8] + fechaActual[9];
    console.log(diaActual);

    let diaX = fechaX[8] + fechaX[9];
    console.log(diaX);

    if (añoX < añoActual) {
        evento = "pasado";
        console.log(evento);
    } else if (añoX > añoActual) {
        evento = "futuro";
        console.log(evento);
    } else if (mesX < mesActual) {
        evento = "pasado";
        console.log(evento);
    } else if (mesX > mesActual) {
        evento = "futuro";
        console.log(evento);
    } else if (diaX < diaActual) {
        evento = "pasado";
        console.log(evento);
    } else if (diaX > diaActual) {
        evento = "futuro";
        console.log(evento);
    } 

    return evento;
}

fecha(fechaActual, fechaX);

let arr = ["Hola"];
console.log(arr);
let chau = "Chau";
arr += chau;
console.log(arr);

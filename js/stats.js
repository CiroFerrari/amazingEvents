// DECLARACIÓN DE VARIABLES GLOBALES
let divGeneralStats = document.getElementById("generalStats");
let divUpcomingStats = document.getElementById("upcomingStats");
let divPastStats = document.getElementById("pastStats");
let data;
let eventos = [];
let eventosPasadosArray = [];
let eventosFuturosArray = [];
let fechaActual = "";

// FUNCIÓN ASÍNCRONA QUE OBTIENE DATOS DE API Y EJECUTA EN BASE A ESOS DATOS
getDatafromAPI();
async function getDatafromAPI() {
    await fetch("https://amazing-events.herokuapp.com/api/events")
        .then(response => response.json())
        .then(json => data = json);
    console.log(data)
    // Extraemos los eventos del Objeto "data"
    eventos = data.events;
    fechaActual = data.currentDate;

    console.log("")
    console.log("Tabla 1:")
    eventosPasadosArray = eventosPasados(eventos);
    eventosFuturosArray = eventosFuturos(eventos);

    let eventoConMayorAudiencia = audienciasCapacidad(eventosPasadosArray)[0];
    console.log(eventoConMayorAudiencia)

    let eventoConMenorAudiencia = audienciasCapacidad(eventosPasadosArray)[1];
    console.log(eventoConMenorAudiencia)

    let eventoConMayorCapacidad = audienciasCapacidad(eventos)[2];
    console.log(eventoConMayorCapacidad)

    console.log("")
    console.log("Tabla 2:");

    let categoriasFuturas = [];
    categoriasFuturas = filterCategories(eventosFuturosArray);

    let categoriasPasadas = [];
    categoriasPasadas = filterCategories(eventosPasadosArray);

    let upcomingStats = calculateStats(categoriasFuturas, eventosFuturosArray);
    console.log("Upcoming Stats: ")
    console.log(upcomingStats)

    let pastStats = calculateStats(categoriasPasadas, eventosPasadosArray);
    console.log("Past Stats: ")
    console.log(pastStats)


    // Función que me retorna el evento con mayor % de audiencia, con menor % de audiencia, y con mayor capacidad
    function audienciasCapacidad(array) {
        let mayorAudiencia = 0;
        let menorAudiencia = 100000000;
        let mayorCapacidad = 0;
        let audienciaEvento = 0;
        let eventoRetornar = [mayorAudiencia, menorAudiencia, mayorCapacidad];
        for (elemento of array) {
            audienciaEvento = Number(elemento.assistance) / Number(elemento.capacity)
            if (audienciaEvento > mayorAudiencia) {
                mayorAudiencia = audienciaEvento;
                eventoRetornar[0] = elemento.name;
            } else if (audienciaEvento < menorAudiencia) {
                menorAudiencia = audienciaEvento;
                eventoRetornar[1] = elemento.name;
            }
            if (Number(elemento.capacity) > mayorCapacidad) {
                mayorCapacidad = Number(elemento.capacity);
                eventoRetornar[2] = elemento.name;
            }
        }
        return eventoRetornar;
    }


    // Función que devuelve las categorías filtradas en base a un array
    function filterCategories(array) {
        categoriasFiltradas = [];
        for (elemento of array) {
            categoriasFiltradas.push(elemento.category)
        }
        let eliminarRepetidos = [...new Set(categoriasFiltradas)]
        return eliminarRepetidos;
    }

    // Función que devuelve las estadisticas de Revenue y Attendance en base a un array de categorias y un array de eventos
    function calculateStats(arrayCategorias, arrayEventos) {
        let categoriesStats = [];
        let revenueCategoria = 0;
        let attendanceCategoria = 0;
        let elementosEnCategoria = 0;

        for (categoria of arrayCategorias) {
            revenueCategoria = 0;
            attendanceCategoria = 0;
            elementosEnCategoria = 0;
            for (elemento of arrayEventos) {
                if (elemento.category == categoria) {
                    if (elemento.date > fechaActual) {
                        revenueCategoria += Number(elemento.price) * Number(elemento.estimate);
                        attendanceCategoria += Number(elemento.estimate) / Number(elemento.capacity) * 100;
                        elementosEnCategoria++;
                    } else {
                        revenueCategoria += Number(elemento.price) * Number(elemento.assistance);
                        attendanceCategoria += Number(elemento.assistance) / Number(elemento.capacity) * 100;
                        elementosEnCategoria++;
                    }
                }
            }
            categoriesStats.push(
                {
                    category: categoria,
                    revenue: revenueCategoria / elementosEnCategoria,
                    attendance: attendanceCategoria / elementosEnCategoria
                }
            )
        }
        return categoriesStats;
    }

    // Función para filtrar los eventos futuros en base a un Array
    function eventosFuturos(array) {
        let arrayFuturo = [];
        for (elemento of array) {
            if (elemento.date > fechaActual) {
                arrayFuturo.push(elemento);
            }
        }
        return arrayFuturo;
    }

    // Función para filtrar los eventos pasados en base a un Array
    function eventosPasados(array) {
        let arrayPasado = [];
        for (elemento of array) {
            if (elemento.date < fechaActual) {
                arrayPasado.push(elemento);
            }
        }
        return arrayPasado;
    }

    imprimirTablaGeneral()
    function imprimirTablaGeneral() {
        let fila = document.createElement('tr')
        fila.innerHTML = `    
                <td class="text-center">${eventoConMayorAudiencia} </td>
                <td class="text-center">${eventoConMenorAudiencia} </td>
                <td class="text-center">${eventoConMayorCapacidad} </td>
                `
        divGeneralStats.appendChild(fila);
    }

    imprimirTabla2y3(upcomingStats, pastStats)

    function imprimirTabla2y3(arrayFuturo, arrayPasado) {
        for (elemento of arrayFuturo) {
            let fila = document.createElement('tr')
            fila.innerHTML = `    
                        <td>${elemento.category} </td>
                        <td class="text-center">$${elemento.revenue.toFixed(2)} </td>
                        <td class="text-center">%${elemento.attendance.toFixed(2)} </td>
                        `
            divUpcomingStats.appendChild(fila);
        }
        for (elemento of arrayPasado) {
            let fila = document.createElement('tr')
            fila.innerHTML = `    
                    <td>${elemento.category} </td>
                    <td class="text-center">$${elemento.revenue.toFixed(2)} </td>
                    <td class="text-center">%${elemento.attendance.toFixed(2)} </td>
                    `
            divPastStats.appendChild(fila);
        }
    }


    /*
        let revenuesFuturos = averageRevenues(eventosFuturosArray)
        console.log("Revenues Futuros en $")
        console.log(revenuesFuturos)
        
        // Función que devuelve el promedio de ingresos por evento
        function averageRevenues (array) {
            let totalRevenues = 0;
            for (elemento of array){
                totalRevenues += Number(elemento.price)*Number(elemento.estimate)
            }
            return totalRevenues / array.length;
        }
        
        let asistenciaFutura = averageAssistance(eventosFuturosArray);
        console.log("Estimate Futuros: ")
        console.log("%",asistenciaFutura)
        
        let asistenciaPasada = averageAssistance(eventosPasadosArray);
        console.log("Assistance Pasados: ")
        console.log("%",asistenciaPasada)
        
        function averageAssistance(array) {
            let totalEstimate = 0;
            let totalAssistance = 0;
            for(elemento of array){
                totalEstimate += Number(elemento.estimate) / Number(elemento.capacity);
                totalAssistance += Number(elemento.assistance) / Number(elemento.capacity);
            }
            console.log("Estimate: ",totalEstimate)
            console.log("Assistance", totalAssistance)
        
            if(totalEstimate > 0){
                return (totalEstimate / array.length * 100).toFixed(2);
            } else {
                return (totalAssistance / array.length * 100).toFixed(2);
            }
        }
        */



}
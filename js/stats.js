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

    // Extraemos los eventos del Objeto "data"
    eventos = data.events;
    fechaActual = data.currentDate;

    // Creamos arrays separados para eventos futuros y eventos pasados
    eventosPasadosArray = eventosPasados(eventos);
    eventosFuturosArray = eventosFuturos(eventos);

    // Resolvemos los datos para la Tabla 1
    let eventoConMayorAudiencia = audienciasCapacidad(eventosPasadosArray)[0];      // Asistencia se calcula sólo para eventos pasados

    let eventoConMenorAudiencia = audienciasCapacidad(eventosPasadosArray)[1];      // Asistencia se calcula sólo para eventos pasados

    let eventoConMayorCapacidad = audienciasCapacidad(eventos)[2];                  // Capacidad se calcula para todos los eventos (pasados y futuros)

    //Creamos arrays para categorías futuras y pasadas
    let categoriasFuturas = [];
    categoriasFuturas = filterCategories(eventosFuturosArray);
    
    let categoriasPasadas = [];
    categoriasPasadas = filterCategories(eventosPasadosArray);
    
    // Calculamos las estadísticas para la Tabla 2 - Eventos Futuros
    let upcomingStats = calculateStats(categoriasFuturas, eventosFuturosArray);

    // Calculamos las estadísticas para la Tabla 3 - Eventos Pasados
    let pastStats = calculateStats(categoriasPasadas, eventosPasadosArray);


    // Función que me retorna el evento con mayor % de audiencia, con menor % de audiencia, y con mayor capacidad en base a un array
    function audienciasCapacidad(array) {
        let mayorAudiencia = 0;
        let menorAudiencia = 100000000;
        let mayorCapacidad = 0;
        let audienciaEvento = 0;
        let eventoRetornar = [mayorAudiencia, menorAudiencia, mayorCapacidad];  // Vamos a retornar un array que contenga los 3 resultados que nos interesan
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
        return eventoRetornar;  // De esta manera, recorremos sólo una vez el array, y en una sola función obtenemos los 3 resultados.
    }


    // Función que devuelve las categorías filtradas en base a un array
    function filterCategories(array) {
        let categoriasFiltradas = array.map(elemento => elemento.category);
        return [...new Set(categoriasFiltradas)];
    }

    // Función que devuelve las estadisticas de Revenue y Attendance en base a un array de categorias y un array de eventos
    function calculateStats(arrayCategorias, arrayEventos) {
        let categoriesStats = [];
        let revenueCategoria = 0;
        let attendanceCategoria = 0;
        let elementosEnCategoria = 0;       // Dato para calcular el promedio en cada categoría

        for (categoria of arrayCategorias) {
            revenueCategoria = 0;           // En cada categoría iniciamos seteando los valores en 0
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
            categoriesStats.push(               // Guardamos un Objeto con los 3 datos que nos interesan para cada categoría
                {
                    category: categoria,
                    revenue: revenueCategoria / elementosEnCategoria,
                    attendance: attendanceCategoria / elementosEnCategoria
                }
            )
        }
        return categoriesStats;     // Retorna un Arreglo que contiene Objetos con los datos calculados de cada categoría.
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

    // Impresión de la Tabla 1 en base a los datos calculados
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

    // Impresión de la Tabla 2 y Tabla 3 en base a los resultados calculados
    imprimirTabla2y3(upcomingStats, pastStats)
    function imprimirTabla2y3(arrayFuturo, arrayPasado) {       // Se creó una función con 2 parámetros, en vez de 2 funciones (para eventos futuros y pasados)
        for (elemento of arrayFuturo) {
            divUpcomingStats.appendChild(crearFila(elemento));
        }
        for (elemento of arrayPasado) {
            divPastStats.appendChild(crearFila(elemento));
        }
    }

    // Función que crea una Fila para las tablas 2 y 3 en base a un elemento
    function crearFila(elemento){
        let fila = document.createElement('tr')
        fila.innerHTML = `    
                <td>${elemento.category} </td>
                <td class="text-center">$${elemento.revenue.toFixed(2)} </td>
                <td class="text-center">%${elemento.attendance.toFixed(2)} </td>
                `
        return fila;
    }
}
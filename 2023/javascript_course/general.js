/*
Ejercicio completo

Reciba los promedios de n alumnos por pantalla y cree funciones para calcular el mayor promedio, calcular el promedio total del curso.

Cree una funcion que muestra por pantalla un objeto JSON con la información del alumno con mayor promedio. Puede encontrarlo pues se tiene otro arreglo que permite saber los nombres de los alumnos en paralelo.

*/

function llenarArreglo() {
    var n = prompt("Ingrese el tamaño del arreglo:", "");
    var notas = [];

    for (let i = 0; i < n; i++) {
        let elemento = prompt("Ingrese el elemento " + (i + 1) + ":");
        notas.push(elemento);
    }

    console.log("El arreglo ingresado es:", arreglo);
}

function calcularPromedio(arreglo){
    let promedio = 0;

    for (let i = 0; i < n; i++) {
        promedio = promedio + arreglo[i];
    }

    return promedio/n;
}

function imprimirNotas(){
    for (let i = 0; i < n; i++) {
        console.log(notas[i], " ")
    }
}

llenarArreglo();
imprimirNotas();



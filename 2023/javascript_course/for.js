//1

for (var i = 0; i < 5; i++) {
    console.log(i);
}

//2
var persona = {
    nombre: 'Juan',
    edad: 30,
    profesion: 'Programador'
};

for (var propiedad in persona) {
    console.log(propiedad + ': ' + persona[propiedad]);
}


//3
var frutas = ['manzana', 'banana', 'naranja'];

for (var fruta of frutas) {
    console.log(fruta);
}

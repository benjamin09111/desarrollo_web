array = [1,10,-4,3,2,2,10,1,-7,0,0,12]

//forEach simple: es un for
array.forEach(x => {
    console.log(x)
})

//forEach mas parametros: tengo el dato, index y el arreglo
array.forEach(function(x,index,array){
    console.log(x)
    console.log(index)
    console.log(array)
})

//transformar o alterar cada elemento: map -> crea otro array
const transformed = array.map(x => x*2)

//filtrar: para cada elemento, yo me quiero quedar con...
const filtered = array.filter(x => x%2==0 && x > 0)

//encontrar y devolver elemento. Undefined en caso malo.
const elementSearched = array.find(x => x == 10)

//lo mismo pero me devuelve el indice
const indexSearched = array.findIndex(x => x == 10)

//rellenar en cada posicion, altera array
empty = ["","",""]
empty.fill("Empty")

//todos son... true, false
const result = array.every(x => x > 0)

//existe algun negativo?
const negative = array.some(x => x < 0)

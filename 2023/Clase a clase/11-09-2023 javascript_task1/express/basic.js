const { setTimeout } = require("timers/promises");

const PI = 3.14;
var global = "None";
let local = true;

try{
    PI = 4;
}catch(error){
    console.log("You cannot do that.");
}


function add(x,y){
    return x+y;
}

const addNumbers = (x,y) => x+y
const show = (name) =>{
    console.log(`Hi ${name}!!`);
    console.log("Hope you re good!")
}
console.log(addNumbers(5,4));
show("Benjamin"); 

    const test2 = () => {
        setTimeout(2000);
        console.log("Now!");
    }
    test2();      
    
    const test1 = async() => {
        await setTimeout(2000);
        console.log("Now!");
    }
    test1();  

//JSON
const person = {
    "name":"Benjamin",
    "age":21,
    "alive":true,
    "favorite_games":["LeagueofLegends","Genshin","Honkai"]
}

console.log(person.favorite_games)

const numbers = [1,2,3,4,5,6,7,8];

numbers.map(item => console.log(item));
numbers.forEach(item => console.log(item*2));
console.log(numbers.filter(item => item%2==0));

const array = [
    {
        "name":"Andrew",
        "age":25
    },
    {
        "name":"Sophie",
        "age":23
    }
];

const newArray = array.filter(item => item.age > 24);
console.log(newArray)

const number = 50;

if (number>30) ? console.log("Bigger") : console.log("Lower");
//utilizar dotenv
require("dotenv").config();

//descargar modulo
const express = require('express');

//importar rutas
const routes = require("./route");

//crear app
const app = express();

//añadir variables dotenv
app.set('port', process.env.PORT || 3000);

//usar rutas
app.use(routes);

//encender servidor
app.listen(app.get('port'));
console.log('Server on port', app.get('port'));

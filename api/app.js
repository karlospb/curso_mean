'use strict'

// Aquí gestionaremos todo lo relacionado con Express


var express = require('express');
var bodyParser = require('body-parser');

var app =  express();

// Cargar rutas
var user_routes = require('./routes/user');
var artist_routes = require('./routes/artist');
var album_routes = require('./routes/album');
var song_routes = require('./routes/song');

// Configuración de bodyparser
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

// Configuración de cabeceras HTTP
app.use((req,res,next)=>{
    res.header('Access-Control-Allow-Origin','*');
    res.header('Access-Control-Allow-Headers','Authorization, X-API-KEY,Origin, X-Requested-With,Content-Type, Accept, Accept-Control-Allow-REquest-Method');
    res.header('Access-Control-Allow-Methods','GET, POST,OPTIONS,PUT,DELETE');
    res.header('Allow','GET, POST,OPTIONS,PUT,DELETE');

    next();
});
// Cargar rutas base
app.use('/api', user_routes);
app.use('/api', artist_routes);
app.use('/api',album_routes);
app.use('/api',song_routes);

// Ejemplo de método GET
/*app.get('/pruebas',function(req, res){
    res.status(200).send({message:'Bienvenido al curso de Carlos Pedraz'});
});*/

// Exportamos el módulo
module.exports = app;
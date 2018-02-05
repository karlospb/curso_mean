'use strict'
// Cargamos el fichero de express
var app = require('./app');

// Configuramos un puerto para nuestra API REST
var port = process.env.PORT || 3977;

var mongoose = require('mongoose');


// Quitar aviso de Mongoose Promise de la consola
mongoose.Promise = global.Promise;
// Conexión a la BBDD 
mongoose.connect('mongodb://localhost:27017/curso_mean2',(err,res) =>{
    if(err){
        throw err;
    }else{
        console.log('La conexión a la base de datos está corriendo correctamente...');
        //Para que el servidor escuche
        app.listen(port, function(){
            console.log('Servidor del API REST de música escuchando en HTTP://localhost:'+port);
        });
    }
});
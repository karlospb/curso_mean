'use strict'

// Definición para acceder a la BBDD
var mongoose = require('mongoose');

//Definición para esquemas de la BBDD
var Schema = mongoose.Schema;

//Creación de un esquema para el usuario
var SongSchema = Schema({
    number: String,
    name: String,
    duration: String,
    file: String,
    album: {type: Schema.ObjectId, ref: 'Album'}
});

//Exportamos el modelo
module.exports = mongoose.model('Song', SongSchema); 

'use strict'

// Definición para acceder a la BBDD
var mongoose = require('mongoose');

//Definición para esquemas de la BBDD
var Schema = mongoose.Schema;

//Creación de un esquema para el usuario
var AlbumSchema = Schema({
    title: String,
    description: String,
    year: Number,
    image: String,
    artist: {type: Schema.ObjectId, ref: 'Artist'}
});

//Exportamos el modelo
module.exports = mongoose.model('Album', AlbumSchema); 

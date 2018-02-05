'use strict'

// Definición para acceder a la BBDD
var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');

//Definición para esquemas de la BBDD
var Schema = mongoose.Schema;


//Creación de un esquema para el usuario
var ArtistSchema = Schema({
    name: String,
    description: String,
    image: String
});

ArtistSchema.plugin(mongoosePaginate);

//Exportamos el modelo
module.exports = mongoose.model('Artist', ArtistSchema);

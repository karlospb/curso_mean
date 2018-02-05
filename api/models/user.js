'use strict'

// Definición para acceder a la BBDD
var mongoose = require('mongoose');

//Definición para esquemas de la BBDD
var Schema = mongoose.Schema;

//Creación de un esquema para el usuario
var UserSchema = Schema({
    name: String,
    surname: String,
    email: String,
    password: String,
    role: String,
    image: String
});

//Exportamos el modelo
module.exports = mongoose.model('User' , UserSchema);

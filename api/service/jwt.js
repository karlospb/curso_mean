'use strict'

//Importamos JWT para los TOKENS
var jwt = require('jwt-simple');
//Importamos MOMENT para controlar la fecha de expiración del TOKEN para ver si funciona la autentificación
var moment = require('moment');

var secret = 'clave_secreta_curso';

exports.createToken = function(user){
    var payload = {
        sub: user._id,
        name: user.name,
        surname: user.surname,
        email: user.email,
        role: user.role,
        image: user.image,
        iat: moment().unix(),
        exp: moment().add(30,'days').unix()
    };
    return jwt.encode(payload, secret);
};

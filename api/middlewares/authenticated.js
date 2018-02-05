'use strict'

//Importamos JWT para los TOKENS
var jwt = require('jwt-simple');
//Importamos MOMENT para controlar la fecha de expiración del TOKEN para ver si funciona la autentificación
var moment = require('moment');

var secret = 'clave_secreta_curso';

exports.ensureAuth = function(req,res,next){
    //En el caso de que no exista la autorización
    if(!req.headers.authorization){
        return res.status(403).send({message:'La petición no tiene la cabecera de autentificación'});
    }
    // En el caso de que exista la autorización
    var token = req.headers.authorization.replace(/['"]+/g,'');
    // Se decodifica el token
    try{
        var payload = jwt.decode(token, secret);

        if(payload.exp <= moment().unix()){
            return res.status(401).send({message:'El token ha expirado'});
        }
    }catch(ex){
        //console.log(ex);
        return res.status(404).send({message:'Token no válido'});
    }
    req.user = payload;

    next();
}
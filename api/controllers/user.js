'use strict'

//Definición de variable para encriptar la contraseña
var bcrypt = require('bcrypt-nodejs');

//Definición de variable para utilizar el módelo de usuario en los metodos
var User = require('../models/user');

//Cargamos el servicio que hemos creado para los Tokens
var jwt = require('../service/jwt');

//Cargamos los módulos necesarios para trabajar con el sistema de ficheros
var fs = require('fs');
var path = require('path');

function pruebas(req, res){
    res.status(200).send({
        message: 'Probando una acción del controlador de usuarios del API REST con Node y Mongo'
    })
}

// Metodo de "Alta de usarios"
function saveUser(req,res){
    var user = new User();

    // Recogemos los parámetros recibidos por POST
    var params = req.body;

    console.log(params);
    
    user.name = params.name;
    user.surname = params.surname;
    user.email = params.email;
    user.role = 'ROLE_ADMIN'; //Fijo temporalmente
    user.image = 'null';

    //Encriptación de la contraseña y guardar datos
    if(params.password){
        console.log('Llega contraseña');
        bcrypt.hash(params.password,null,null,function(err,hash){
            user.password = hash;
            console.log(user.name+'+++'+user.surname+'+++'+user.email);
            if(user.name != null && user.surname != null && user.email != null){
                //Guarda el registro JSON en la BBDD
                user.save((err, userStored) =>{
                    if(err){
                        res.status(500).send({message: 'Error al guardar el usuario'});
                    }else{
                        if(!userStored){
                            res.status(404).send({message: 'No se ha registrado el usuario'});
                        }else{
                            res.status(200).send({user: userStored}); 
                        }
                    }
                })
            }else{
                res.status(200).send({message: 'Introduce todos los campos'});        
            }
        })
    }else{
        res.status(200).send({message: 'Introduce contraseña'});
    }
}

//Metodo para comprobar que el email y la contraseña existe en la BBDD
function loginUser(req,res){
    //Convertimos lo recibido (req) en JSON
    var params = req.body;

    var email = params.email;
    var password = params.password;
    //Realizamos la busqueda en la BBDD
    User.findOne({email: email.toLowerCase()},(err,user) =>{
        if(err){
            res.status(500).send({message:'Error en la petición'});
        }else{
            if(!user){
                res.status(404).send({message:'El usuario no existe'});
            }else{
                // Comprobación de que la contraseña es correcta
                bcrypt.compare(password,user.password, function(err,check){
                    if(check){
                        //Es correcta y se devuelve los datos del usuario
                        if(params.gethash){
                            //Se devuelve un Token de JWT
                            res.status(200).send({
                                token: jwt.createToken(user)
                            });
                        }else{
                            res.status(200).send({user});
                        }
                    }else{
                        res.status(404).send({message:'El usuario no ha podido logearse'});
                    }
                })
            }
        }
    });
}

//Método para actualizar un usuario
function updateUser(req,res){
    var userId = req.params.id;
    var update = req.body;

    User.findByIdAndUpdate(userId,update, (err,userUpdated)=>{
        if(err){
            res.status(500).send({message:'Error al actualizar el usuario'});
        }else{
            if(!userUpdated){
                res.status(404).send({message:'No se ha podido actualizar el usuario'});
            }else{
                res.status(200).send({message:userUpdated});
            }
        }
    })
}

//Método para la subida de la imagen del usuario
function uploadImage(req,res){
    var userId = req.params.id;
    var file_name = 'No subido...';

    if(req.files){
        var file_path = req.files.image.path;
        var file_split = file_path.split('\\');
        var file_name = file_split[2];
        
        // Comprobación de la extensión del fichero recibido
        var ext_split = file_name.split('\.');
        var file_ext = ext_split[1];

        if(file_ext=='png' || file_ext=='jpg'||file_ext=='gif'){
            User.findByIdAndUpdate(userId,{image: file_name}, (err, userUpdated)=>{
                if(!userUpdated){
                    res.status(404).send({message:'No se ha podido actualizar el usuario'});
                }else{
                    res.status(200).send({image: file_name, user: userUpdated});
                }   
            });
        }else{
            res.status(200).send({message: 'Extensión del archivo no valida'});
        }

        console.log(ext_split);
    }else{
        res.status(200).send({message:'No has subido la imagen...'});
    }
}

//Método para conseguir la imagen del usuario
function getImageFile(req,res){
    var imageFile = req.params.imageFile;
    var path_file = './uploads/users/'+imageFile;

    fs.exists(path_file,function(exists){
        if(exists){
            res.sendFile(path.resolve(path_file)); 
        }else{
            res.status(200).send({message: 'No existe la imagen...'});
        }
    });
}

// Exportamos los métodos
module.exports = {
    pruebas,
    saveUser,
    loginUser,
    updateUser,
    uploadImage,
    getImageFile
};
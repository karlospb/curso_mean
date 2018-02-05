'use strict'
// Importamos las librerías para trabajar con el sistema de ficheros
var path = require('path');
var fs = require('fs');

//Importamos el módulo de paginación de Mongoose
var mongoosePaginate = require('mongoose-paginate');
var mongoosePagination = require('mongoose-pagination');

//Importamos nuestros modelos
var Artist = require('../models/artist');
var Album = require('../models/album');
var Song = require('../models/song');

// Método para la obtención de un albúm 
function getAlbum(req,res){
    var albumId = req.params.id;
   

    Album.findById(albumId).populate({path: 'artist'}).exec((err,album)=>{
        if(err){
            res.status(500).send({message:'Error en la petición de albúm'});
        }else{
            if(!album){
                res.status(404).send({message: 'El albúm no existe'});
            }else{
                res.status(200).send({message: album});
            }
        }
    });
}

// Método para guardar artistas
function saveAlbum(req,res){
    var album = new Album();

    var params = req.body;
    album.title = params.title;
    album.description = params.description;
    album.year = params.year;
    album.image = 'null';
    album.artist = params.artist;

    album.save((err,albumStored)=> {
        if(err){
            res.status(500).send({message:'Error al guardar el albúm'});
        }else{
            if(!albumStored){
                res.status(404).send({message: 'El albúm no ha sido guardado'});
            }else{
                res.status(200).send({album: albumStored});
            }
        }
    })
}


// Método para obtener varios albums de un artista
function getAlbums(req,res){
    var artistId = req.params.artist;
    if(!artistId){
        //Sacar todos los albums de la BBDD
        var find = Album.find({}).sort('title');
    }else{
        //Sacar los albums de un artista concreto de la BBDD
        var find = Album.find({artist:artistId}).sort('year');
    }

    find.populate({path: 'artist'}).exec((err,albums)=>{
        if(err){
            res.status(500).send({message:'Error en la petición'});
        }else{
            if(!albums){
                res.status(404).send({message:'No hay albums !!'});
            }else{
                return res.status(200).send({albums});
            }
        }    
    });
}

//Método para actualizar album
function updateAlbum(req, res){
    var albumId = req.params.id;
    var update = req.body;

    Album.findByIdAndUpdate(albumId,update, (err, albumUpdated) =>{
        if(err){
            res.status(500).send({message: 'Error al actualizar el artista'});
        }else{
            if(!albumUpdated){
                res.status(404).send({message: 'El artista no ha sido actualizado'});
            }else{
                return res.status(200).send({album: albumUpdated});
            }
        }
    })
}

//Método para eliminar artista
function deleteAlbum(req, res){
    var albumId = req.params.id;
        
    Album.findByIdAndRemove(albumId, (err, albumRemoved) =>{
        if(err){
            res.status(500).send({message: 'Error al eliminar el albúm del artista'});
        }else{
            if(!albumRemoved){
                res.status(404).send({message: 'El albúm del artista no ha sido eliminado'});
            }else{
                Song.find({album: albumRemoved.id}).remove((err,songRemoved)=>{
                    if(err){
                        res.status(500).send({message: 'Error al eliminar la canción del albúm del artista'});
                    }else{
                        if(!songRemoved){
                            res.status(404).send({message: 'La canción del albúm del artista no ha sido eliminado'});
                        }else{
                            res.status(200).send({album: albumRemoved});
                        }
                    }
                });
            }
        }
    });
}

//Método para cargar imagen del artista
function uploadImage(req,res){
    var albumId = req.params.id;
    var file_name = 'No subido ...';

    if(req.files){
        var file_path = req.files.image.path;
        var file_split = file_path.split('\\');
        var file_name = file_split[2];
        
        // Comprobación de la extensión del fichero recibido
        var ext_split = file_name.split('\.');
        var file_ext = ext_split[1].toLowerCase();
        
        if(file_ext=='png' || file_ext=='jpg'||file_ext=='gif'){
            Album.findByIdAndUpdate(albumId,{image: file_name}, (err, albumUpdated)=>{
                if(!albumUpdated){
                    res.status(404).send({message:'No se ha podido actualizar el album'});
                }else{
                    res.status(200).send({album: albumUpdated});
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
    var path_file = './uploads/album/'+imageFile;

    fs.exists(path_file,function(exists){
        if(exists){
            res.sendFile(path.resolve(path_file)); 
        }else{
            res.status(200).send({message: 'No existe la imagen...'});
        }
    });
}


// Exportamos nuestros métodos
module.exports = {
    getAlbum,
    saveAlbum,
    getAlbums,
    updateAlbum,
    deleteAlbum,
    uploadImage,
    getImageFile
}
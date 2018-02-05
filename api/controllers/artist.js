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

// Método para la obtención de un artista  
function getArtist(req,res){
    var artistId = req.params.id;

    Artist.findById(artistId, (err,artist)=>{
        if(err){
            res.status(500).send({message:'Error en la petición'});
        }else{
            if(!artist){
                res.status(404).send({message: 'El artista no existe'});
            }else{
                res.status(200).send({message: artist});
            }
        }
    });
}

// Método para guardar artistas
function saveArtist(req,res){
    var artist = new Artist();

    var params = req.body;
    artist.name = params.name;
    artist.description = params.description;
    artist.image = null;

    artist.save((err,artistStored)=> {
        if(err){
            res.status(500).send({message:'Error al guardar el artista'});
        }else{
            if(!artistStored){
                res.status(404).send({message: 'El artista no ha sido guardado'});
            }else{
                res.status(200).send({artist: artistStored});
            }
        }
    })
}


// Método para obtener varios artistas
function getArtists(req,res){
    if(req.params.page){
        var page = req.params.page;
    }else{
        var page = 1;
    }
    var itemsPerPage = 3;
    
    Artist.paginate({},{sort: 'name', limit: itemsPerPage , page: page}, function(err,result){
        if(err){
            console.log(err);
            res.status(500).send({message:'Error en la petición'});
        }else{
            if(result.docs==[]){
                res.status(404).send({message:'No hay artistas !!'});
            }else{
                return res.status(200).send({
                    total: result.total,
                    artists: result.docs
                });
            }
        }
    });
}

//Método para actualizar artistas
function updateArtist(req, res){
    var artistId = req.params.id;
    var update = req.body;

    Artist.findByIdAndUpdate(artistId,update, (err, artistUpdated) =>{
        if(err){
            res.status(500).send({message: 'Error al guardar el artista'});
        }else{
            if(!artistUpdated){
                res.status(404).send({message: 'El artista no ha sido actualizado'});
            }else{
                return res.status(200).send({artist: artistUpdated});
            }
        }
    })
}

//Método para eliminar artista
function deleteArtist(req, res){
    var artistId = req.params.id;
    console.log('entra');
    
    Artist.findByIdAndRemove(artistId, (err, artistRemove) =>{
        if(err){
            res.status(500).send({message: 'Error al eliminar el artista'});
        }else{
            if(!artistRemove){
                res.status(404).send({message: 'El artista no ha sido eliminado'});
            }else{
                Album.find({artist: artistRemove.id}).remove((err,albumRemoved)=>{
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
                                        res.status(200).send({artist: artistRemove});
                                    }
                                }
                            });
                        }
                    }
                });
            }
        }
    });
}

//Método para cargar imagen del artista
function uploadImage(req,res){
    var artistId = req.params.id;
    var file_name = 'No subido ...';

    if(req.files){
        var file_path = req.files.image.path;
        var file_split = file_path.split('\\');
        var file_name = file_split[2];
        
        // Comprobación de la extensión del fichero recibido
        var ext_split = file_name.split('\.');
        var file_ext = ext_split[1].toLowerCase();
        
        console.log(file_ext);

        if(file_ext=='png' || file_ext=='jpg'||file_ext=='gif'){
            Artist.findByIdAndUpdate(artistId,{image: file_name}, (err, artistUpdated)=>{
                if(!artistUpdated){
                    res.status(404).send({message:'No se ha podido actualizar el artista'});
                }else{
                    res.status(200).send({artist: artistUpdated});
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
    var path_file = './uploads/artist/'+imageFile;

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
    getArtist,
    saveArtist,
    getArtists,
    updateArtist,
    deleteArtist,
    uploadImage,
    getImageFile
}
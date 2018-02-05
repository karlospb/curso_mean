'use strict'

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
function getSong(req,res){
    var songId = req.params.id;
   

    Song.findById(songId).populate({path: 'album'}).exec((err,song)=>{
        if(err){
            res.status(500).send({message:'Error en la petición de canción'});
        }else{
            if(!song){
                res.status(404).send({message: 'La canción no existe'});
            }else{
                res.status(200).send({message: song});
            }
        }
    });
}

// Método para dar de alta una nueva canción
function saveSong(req,res){
    var song = new Song();

    var params = req.body;
    song.number = params.number;
    song.name = params.name; 
    song.duration = params.duration;
    song.file = null;
    song.album = params.album;

    song.save((err,songStored)=> {
        if(err){
            res.status(500).send({message:'Error al guardar la canción'});
        }else{
            if(!songStored){
                res.status(404).send({message: 'La canción no ha sido guardado'});
            }else{
                res.status(200).send({song: songStored});
            }
        }
    })
}

// Método para obtener las conciones de un album
function getSongs(req, res) {
    var albumId = req.params.album;
    if (!albumId) {
        //Sacar todos los albums de la BBDD
        var find = Song.find({}).sort('name');
    } else {
        //Sacar los albums de un artista concreto de la BBDD
        var find = Song.find({ album: albumId }).sort('number');
    }

    find.populate({ 
        path: 'album',
        populate: {
            path: 'artist',
            model: 'Artist'
        }}).exec((err, songs) => {
        if (err) {
            res.status(500).send({ message: 'Error en la petición' });
        } else {
            if (!songs) {
                res.status(404).send({ message: 'No hay canciones !!' });
            } else {
                return res.status(200).send({ songs });
            }
        }
    });
}

// Método para actualizar una canción
function updateSong(req,res) {
    var songId = req.params.id;
    var update = req.body;

    Song.findByIdAndUpdate(songId,update, (err,songUpdate)=>{
        if(err){
            res.status(500).send({message:'Error al actualizar la canción'});
        }else{
            if(!songUpdate){
                res.status(404).send({message:'La canción no existe para poder actualizar'});
            }else{
                res.status(200).send({song: songUpdate});
            }
        }
    })
}

// Método para elimnar una canción
function deleteSong(req,res){
    var songId = req.params.id;

    Song.findByIdAndRemove(songId,(err,songRemoved)=>{
        if(err){
            res.status(500).send({message:'Error al eliminar la canción'});
        }else{
            if(!songRemoved){
                res.status(404).send({message:'La canción no existe'});
            }else{
                res.status(200).send({song:songRemoved});
            }
        }
    });
}

// Método para subir una canción
function uploadFile(req, res) {
    var songId = req.params.id;
    var file_name = 'No subido ...';

    if (req.files) {
        var file_path = req.files.file.path;
        var file_split = file_path.split('\\');
        var file_name = file_split[2];

        // Comprobación de la extensión del fichero recibido
        var ext_split = file_name.split('\.');
        var file_ext = ext_split[1].toLowerCase();

        if (file_ext == 'mp3' || file_ext == 'ogg') {
            Song.findByIdAndUpdate(songId, { file: file_name }, (err, songUpdate) => {
                if (!songUpdate) {
                    res.status(404).send({ message: 'No se ha podido actualizar la canción' });
                } else {
                    res.status(200).send({ song: songUpdate });
                }
            });
        } else {
            res.status(200).send({ message: 'Extensión del archivo no valida' });
        }

        console.log(ext_split);
    } else {
        res.status(200).send({ message: 'No has subido la canción...' });
    }
}

//Método para conseguir la imagen del usuario
function getSongFile(req, res) {
    var songFile = req.params.songFile;
    var path_file = './uploads/songs/' + songFile;

    fs.exists(path_file, function (exists) {
        if (exists) {
            res.sendFile(path.resolve(path_file));
        } else {
            res.status(200).send({ message: 'No existe la canción...' });
        }
    });
}

module.exports = {
    getSong,
    saveSong,
    getSongs,
    updateSong,
    deleteSong,
    uploadFile,
    getSongFile
}
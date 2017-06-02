'use strict'

const Artist = require('../models/artist');
const Album = require('../models/album');
const Song = require('../models/song');
const fs = require('fs');
const path = require('path');
const mongoosePaginate = require('mongoose-pagination');

function getSong(req, res) {
  var songId = req.params.id;

  Song.findById(songId).populate({path: 'album'}).exec((err, song) => {
    if (err) {
      res.status(500).send({message: 'Error en la petición'})
    } else {
      if (!song) {
        res.status(404).send({message: 'No existe la canción'})
      } else {
        res.status(200).send({song})
      }
    }
  })
}

function getSongs(req, res) {
  var albumId = req.params.album

  if (!albumId) {
    var find = Song.find({}).sort('number')
  } else {
    var find = Song.find({album: albumId}).sort('number')
  }

  find.populate({
    path: 'album',
    populate: {
      path: 'artist',
      model: 'Artist'
    }
  }).exec((err, songs) =>{
    if (err) {
      res.status(500).send({message: 'Error en la petición'})
    } else {
      if (!songs) {
        res.status(404).send({message: 'No existe canciones'})
      } else {
        res.status(200).send({songs})
      }
    }
  })
}

function saveSong(req, res) {
  var song = new Song();
  var params = req.body

  song.number = params.number
  song.name = params.name
  song.duration = params.duration
  song.file = null
  song.album = params.album

  song.save((err, songStored) => {
    if (err) {
      res.status(500).send({message: 'Error en el servidor guardar canción'})
    } else {
      if (!songStored) {
        res.status(404).send({message: 'NO se ha guardado la canción'})
      } else {
        res.status(200).send({song: songStored})
      }
    }
  })
}

function updateSong(req, res) {
  var songId = req.params.id;
  var update = req.body

  Song.findByIdAndUpdate(songId, update, (err, songUpdate) =>{
    if (err) {
      res.status(500).send({message: 'Error en el servidor update canción'})
    } else {
      if (!songUpdate) {
        res.status(404).send({message: 'NO se ha actualizado la canción'})
      } else {
        res.status(200).send({song: songUpdate})
      }
    }
  })
}

function deleteSong(req, res) {
  var songId = req.params.id;

  Song.findByIdAndRemove(songId, (err, songRemoved) => {
    if (err) {
      res.status(500).send({message: 'Error en la petición songRemoved'})
    } else {
      if (!songRemoved) {
        res.status(404).send({message: 'La canción no fue eliminada'})
      } else {
        res.status(200).send({song: songRemoved})
      }
    }
  })
}

function uploadFile(req, res) {
  var songId = req.params.id;
  var file_name = 'No upload...';

  if (req.files) {
    var file_path = req.files.file.path;
    var file_split = file_path.split('\\');
    file_name = file_split[2];

    var ext_split = file_name.split('\.');
    var file_ext = ext_split[1];

    if (file_ext == 'mp3' || file_ext == 'm4a') {
      Song.findByIdAndUpdate(songId, {file: file_name}, (err, songFile) => {
        if (err) {
          res.status(500).send({message: 'Error al actualizar el audio'});
        } else {
          if (!songFile) {
            res.status(404).send({message: 'No se ha podido actualizar el audio'});
          }else {
            res.status(200).send({song: songFile});
          }
        }
      });
    }else {
      res.status(404).send({message: 'El tipo de archivo es inválido'});
    }
  }else {
    res.status(404).send({message: 'No hay archivos en la request'});
  }
}

function getSongFile(req, res){
  var file = req.params.songFile;
  var pathFile = './uploads/songs/'+file;

  fs.exists(pathFile, (exists) => {
    if (exists) {
      res.sendFile(path.resolve(pathFile));
    }else {
      res.status(404).send({message: 'No existe el archivo'});
    }
  })
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

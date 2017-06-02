'use strict'

const Artist = require('../models/artist');
const Album = require('../models/album');
const Song = require('../models/song');
const fs = require('fs');
const path = require('path');
const mongoosePaginate = require('mongoose-pagination');

function getAlbum(req, res) {
  var albumId = req.params.id;

  Album.findById(albumId).populate({path: 'artist'}).exec((err, album) => {
    if (err) {
      res.status(500).send({message: 'Error en la petición'})
    } else {
      if (!album) {
        res.status(404).send({message: 'El album no existe'})
      } else {
        res.status(200).send({album})
      }
    }
  })
}

function saveAlbum(req, res) {
  var album = new Album();
  var params = req.body

  album .title = params.title
  album.description = params.description
  album.year = params.year
  album.image = 'null'
  album.artist = params.artist

  album.save((err, albumStored) => {
    if (err) {
        res.status(500).send({message: 'Error en la petición albumStored'})
    } else {
      if (!albumStored) {
        res.status(404).send({message: 'No se pudo guardar el album'})
      } else {
        res.status(200).send({album: albumStored})
      }
    }
  })
}

function getAlbums(req, res) {
  var artistId = req.params.artist;

  if (!artistId) {
    //todos los albumes
    var find =   Album.find().sort('title')
  } else {
    //solo los albumes de un artista
      var find = Album.find({artist: artistId}).sort('year')
  }

  find.populate({path: 'artist'}).exec((err, albums) => {
    if (err) {
      res.status(500).send({message: 'Error en la petición albums'})
    } else {
      if (!albums) {
        res.status(404).send({message: 'NO hay albumes' })
      } else {
        res.status(200).send({albums: albums})

      }
    }
  })
}

function updateAlbum(req, res) {
  var albumId = req.params.id;
  var update = req.body

  Album.findByIdAndUpdate(albumId, update, (err, albumUpdated) => {
    if (err) {
      res.status(500).send({message: 'Error en la petición album'})
    } else {
      if (!albumUpdated) {
        res.status(404).send({message: 'El album no fue actualizado'})
      } else {
        res.status(200).send({album: albumUpdated})
      }
    }
  })
}

function deleteAlbum(req, res) {
  var albumId = req.params.id;

  Album.findByIdAndRemove(albumId, (err, albumRemoved) => {
    if (err) {
      res.status(500).send({message: 'Error en la petición albumRemoved'})
    } else {
      if (!albumRemoved) {
        res.status(404).send({message: 'El album no fue eliminado'})
      } else {
        Song.find({album: albumRemoved._id}).remove((err, songRemoved) => {
          if (err) {
              res.status(500).send({message: 'Error en la petición songRemoved'})
          } else {
            if (!songRemoved) {
              res.status(404).send({message: 'la canción no fue eliminada'})
            } else {
                res.status(200).send({album: albumRemoved})
            }
          }
        })
      }
    }
  })
}

function uploadImage(req, res) {
  var albumId = req.params.id;
  var file_name = 'No upload...';

  if (req.files) {
    var file_path = req.files.image.path;
    var file_split = file_path.split('\\');
    file_name = file_split[2];

    var ext_split = file_name.split('\.');
    var file_ext = ext_split[1];

    if (file_ext == 'png' || file_ext == 'jpg' || file_ext == 'gif') {
      Album.findByIdAndUpdate(albumId, {image: file_name}, (err, albumImage) => {
        if (err) {
          res.status(500).send({message: 'Error al actualizar la imagen del album'});
        } else {
          if (!albumImage) {
            res.status(404).send({message: 'No se ha podido actualizar la imagen del album'});
          }else {
            res.status(200).send({album: albumImage});
          }
        }
      });
    }else {
      res.status(404).send({message: 'El tipo de archivo es inválido'});
    }
  }else {
    res.status(404).send({message: 'No hay imagenes en la request'});
  }
}

function getImageFile(req, res){
  var imageFile = req.params.imageFile;
  var pathFile = './uploads/albums/'+imageFile;

  fs.exists(pathFile, (exists) => {
    if (exists) {
      res.sendFile(path.resolve(pathFile));
    }else {
      res.status(404).send({message: 'No existe la imagen'});
    }
  })
}




module.exports = {
  getAlbum,
  saveAlbum,
  getAlbums,
  updateAlbum,
  deleteAlbum,
  uploadImage,
  getImageFile
};

'use strict'

const Artist = require('../models/artist');
const Album = require('../models/album');
const Song = require('../models/song');
const User = require('../models/user');
const fs = require('fs');
const path = require('path');
const mongoosePaginate = require('mongoose-pagination');

function getArtist(req, res) {
  var artistId = req.params.id;

  Artist.findById(artistId, (err, artist) => {
    if (err) {
      res.status(500).send({message: 'Error en la petición'})
    } else {
      if (!artist) {
        res.status(404).send({message: 'No existe el artista'})
      } else {
        res.status(200).send({artist})
      }
    }
  });
}

function getArtists(req, res) {
  if (req.params.page) {
    var page = req.params.page
  }else {
    var page = 1
  }

  var itemsPerPage = 4

  Artist.find().sort('name').paginate(page, itemsPerPage, (err, artists, total) => {
    if (err) {
      res.status(500).send({message: 'Error en la petición'})
    } else {
      if (!artists) {
        res.status(404).send({message: 'No hay artistas'})
      } else {
        return res.status(200).send({
          total: total,
          artists: artists
        })
      }
    }
  })

}

function saveArtist(req, res){
  var artist = new Artist();
  var params = req.body;

  artist.name = params.name;
  artist.description = params.description;
  artist.image = 'null';

  artist.save((err, artistStored) => {
    if (err) {
      res.status(500).send({message: 'Error al guardar artista'});
    } else {
      if (!artistStored) {
        res.status(404).send({message: 'El artista no fue guardado'});
      } else {
        res.status(200).send({artist: artistStored});
      }
    }
  });
}

function updateArtist(req, res) {
  var artistId = req.params.id;
  var update = req.body

  Artist.findByIdAndUpdate(artistId, update, (err, artistUpdated) => {
    if (err) {
      res.status(500).send({message: 'Error en la petición'})
    } else {
      if (!artistUpdated) {
        res.status(404).send({message: 'El artista no fue actualizado'})
      } else {
        res.status(200).send({artist: artistUpdated})
      }
    }
  })
}

function deleteArtist(req, res) {
  var artistId = req.params.id;

  Artist.findByIdAndRemove(artistId, (err, artistRemoved) => {
    if (err) {
      res.status(500).send({message: 'Error en la petición artistRemoved'})
    } else {
      if (!artistRemoved) {
        res.status(404).send({message: 'El artista no fue eliminado'})
      } else {
        Album.find({artist: artistRemoved._id}).remove((err, albumRemoved) => {
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
                      res.status(200).send({artist: artistRemoved})
                  }
                }
              })
            }
          }
        })
      }
    }
  })
}

function uploadImage(req, res) {
  var artistId = req.params.id;
  var file_name = 'No upload...';

  if (req.files) {
    var file_path = req.files.image.path;
    var file_split = file_path.split('\\');
    file_name = file_split[2];

    var ext_split = file_name.split('\.');
    var file_ext = ext_split[1];

    if (file_ext == 'png' || file_ext == 'jpg' || file_ext == 'gif') {
      Artist.findByIdAndUpdate(artistId, {image: file_name}, (err, artistImage) => {
        if (err) {
          res.status(500).send({message: 'Error al actualizar la imagen del artista'});
        } else {
          if (!artistImage) {
            res.status(404).send({message: 'No se ha podido actualizar la imagen del artista'});
          }else {
            res.status(200).send({artist: artistImage});
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
  var pathFile = './uploads/artists/'+imageFile;

  fs.exists(pathFile, (exists) => {
    if (exists) {
      res.sendFile(path.resolve(pathFile));
    }else {
      res.status(404).send({message: 'No existe la imagen'});
    }
  })
}

function getImageFileById(req, res){
  var artistId = req.params.artistId;

  Artist.findById(artistId, (err, artist) => {
    if (err) {
      console.log(err);
    } else {
      if (!artist) {
        console.log('El artista no existe');
      } else {
        imageFile = artist.image
        var pathFile = './uploads/artists/'+imageFile;

        fs.exists(pathFile, (exists) => {
          if (exists) {
            res.sendFile(path.resolve(pathFile));
          }else {
            res.status(404).send({message: 'No existe la imagen'});
          }
        })
      }
    }
  })
}

module.exports = {
  getArtist,
  saveArtist,
  getArtists,
  updateArtist,
  deleteArtist,
  uploadImage,
  getImageFile,
  getImageFileById
};

'use strict'

const User = require('../models/user');
const bcrypt = require('bcrypt-nodejs');
const jwt = require('../services/jwt');
const fs = require('fs');
const path = require('path');

function pruebas(req, res){
  res.status(200).send({
    message: 'Probando una acción del controlador usuarios con nodeJS'
  });
}

function saveUser(req, res){
  var user = new User();
  var params = req.body;

  console.log(params);

  user.name = params.name;
  user.surname = params.surname;
  user.email = params.email;
  user.role = 'ROLE_USER';
  user.image = 'null';

  if (params.password) {
    // encriptar contraseña y guardar datos
    bcrypt.hash(params.password, null, null, (err, hash) => {
      user.password = hash;
      if (user.name != null && user.surname != null && user.email != null) {
        user.save((err, userStored) => {
          if (err) {
            res.status(500).send({
              message: 'Error al guardar el usuario'
            });
          }else {
            if (!userStored) {
              res.status(404).send({
                message: 'No se ha registrado el usuario'
              });
            }else {
              res.status(200).send({
                user: userStored
              });
            }
          }
        });
      }else {
        res.status(200).send({
          message: 'Introduce todos los campos'
        });
      }
    });
  }else {
    res.status(200).send({
      message: 'Introduce contraseña'
    });
  }

}

function loginUser(req, res){
  var params = req.body;

  var email = params.email;
  var password = params.password;

  User.findOne({email: email.toLowerCase()}, (err, user) => {
    if (err) {
      res.status(500).send({message: 'Error en la petición'});
    } else {
      if (!user) {
        res.status(404).send({message: 'El usuario no existe'});
      }else {
        bcrypt.compare(password, user.password, (err, check) => {
          if (check) {
            if (params.gethash) {
              res.status(200).send({
                token: jwt.createToken(user)
              });
            }else {
              res.status(200).send({user});
            }
          } else {
            res.status(404).send({message: 'El usuario no ha podido loguearse'});
          }
        });
      }
    }
  });
}

function updateUser(req, res){
  var userId = req.params.id;
  var update = req.body;

  if (userId != req.user.sub) {
    return res.status(500).send({message: 'No tienes permiso para actualizar este usuario'});
  }

  User.findByIdAndUpdate(userId, update, (err, userUpdated) => {
    if (err) {
      res.status(500).send({message: 'Error al actualizar el usuario'});
    }else {
      if (!userUpdated) {
        res.status(404).send({message: 'No se ha podido actualizar el usuario'});
      }else {
        res.status(200).send({user: userUpdated});
      }
    }
  });
}

function uploadImage(req, res){
  var userId = req.params.id;
  var file_name = 'No upload...';

  if (req.files) {
    var file_path = req.files.image.path;
    var file_split = file_path.split('\\');
    file_name = file_split[2];

    var ext_split = file_name.split('\.');
    var file_ext = ext_split[1];

    if (file_ext == 'png' || file_ext == 'jpg' || file_ext == 'gif') {
      User.findByIdAndUpdate(userId, {image: file_name}, (err, userImage) => {
        if (err) {
          res.status(500).send({message: 'Error al actualizar la imagen del usuario'});
        } else {
          if (!userImage) {
            res.status(404).send({message: 'No se ha podido actualizar la imagen del usuario'});
          }else {
            res.status(200).send({image: file_name, user: userImage});
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
  var pathFile = './uploads/users/'+imageFile;

  fs.exists(pathFile, (exists) => {
    if (exists) {
      res.sendFile(path.resolve(pathFile));
    }else {
      res.status(404).send({message: 'No existe la imagen'});
    }
  })
}

module.exports = {
  pruebas,
  saveUser,
  loginUser,
  updateUser,
  uploadImage,
  getImageFile
};

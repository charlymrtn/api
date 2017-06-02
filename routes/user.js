'use strict'

const express = require('express');
const UserController = require('../controllers/user');
const md_auth = require('../middleware/authenticated');

const api = express.Router();
const multipart = require('connect-multiparty');
const md_upload = multipart({
  uploadDir: './uploads/users'
});

api.get('/probando-controlador', md_auth.ensureAuth, UserController.pruebas);
api.post('/register', UserController.saveUser);
api.post('/login', UserController.loginUser);
api.put('/update-user/:id', md_auth.ensureAuth, UserController.updateUser);
api.post('/upload-image-user/:id', [md_auth.ensureAuth, md_upload], UserController.uploadImage);
api.get('/get-image-user/:imageFile', UserController.getImageFile);

module.exports = api;

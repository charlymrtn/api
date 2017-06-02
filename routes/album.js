'use strict'

const express = require('express');
const AlbumController = require('../controllers/album');

const api = express.Router();
const md_auth = require('../middleware/authenticated');
const multipart = require('connect-multiparty');
const md_upload = multipart({
  uploadDir: './uploads/albums'
});

api.get('/album/:id', md_auth.ensureAuth, AlbumController.getAlbum);
api.get('/albums/:artist?', md_auth.ensureAuth, AlbumController.getAlbums);
api.post('/album', md_auth.ensureAuth, AlbumController.saveAlbum);
api.put('/album/:id', md_auth.ensureAuth, AlbumController.updateAlbum);
api.post('/upload-image-album/:id', [md_auth.ensureAuth, md_upload], AlbumController.uploadImage);
api.get('/get-image-album/:imageFile', AlbumController.getImageFile);
api.delete('/album/:id', md_auth.ensureAuth, AlbumController.deleteAlbum);

module.exports = api;

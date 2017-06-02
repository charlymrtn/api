'use strict'

const express = require('express');
const ArtistController = require('../controllers/artist');

const api = express.Router();
const md_auth = require('../middleware/authenticated');
const multipart = require('connect-multiparty');
const md_upload = multipart({
  uploadDir: './uploads/artists'
});

api.get('/artist/:id', md_auth.ensureAuth, ArtistController.getArtist);
api.get('/artists/:page?', md_auth.ensureAuth, ArtistController.getArtists);
api.post('/artist', md_auth.ensureAuth, ArtistController.saveArtist);
api.post('/upload-image-artist/:id', [md_auth.ensureAuth, md_upload], ArtistController.uploadImage);
api.get('/get-image-artist/:imageFile', ArtistController.getImageFile);
api.get('/get-image-artist-id/:id', ArtistController.getImageFileById);
api.put('/artist/:id', md_auth.ensureAuth, ArtistController.updateArtist);
api.delete('/artist/:id', md_auth.ensureAuth, ArtistController.deleteArtist);

module.exports = api;

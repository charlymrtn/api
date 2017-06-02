'use strict'

const express = require('express');
const SongController = require('../controllers/song');

const api = express.Router();
const md_auth = require('../middleware/authenticated');
const multipart = require('connect-multiparty');
const md_upload = multipart({
  uploadDir: './uploads/songs'
});

api.get('/song/:id', md_auth.ensureAuth, SongController.getSong);
api.get('/songs/:album?', md_auth.ensureAuth, SongController.getSongs);
api.post('/song', md_auth.ensureAuth, SongController.saveSong);
api.put('/song/:id', md_auth.ensureAuth, SongController.updateSong);
api.post('/upload-file-song/:id', [md_auth.ensureAuth, md_upload], SongController.uploadFile);
api.get('/get-song-file/:songFile', SongController.getSongFile);
api.delete('/song/:id', md_auth.ensureAuth, SongController.deleteSong);

module.exports = api;

'use strict'

const express = require('express');
const bodyParser = require('body-parser');

const app = express();

//cargar rutas
const user_routes = require('./routes/user');
const artist_routes = require('./routes/artist');
const album_routes = require('./routes/album');
const song_routes = require('./routes/song');

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

//configurar cabeceras http
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method')
  res.header('Access-Control-Allow-Methods', 'GET , POST, PUT, DELETE, OPTIONS')
  res.header('Allow', 'GET , POST, PUT, DELETE, OPTIONS')

   next();
})

//rutas base
app.use('/api', [
  user_routes,
  artist_routes,
  album_routes,
  song_routes
]);

module.exports = app;

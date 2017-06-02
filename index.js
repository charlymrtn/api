'use strict'

const mongoose = require('mongoose');
const MongoClient = require('mongodb').MongoClient;
const app = require('./app');
const port = process.env.PORT || 3977;

var uri = "mongodb://charly_mrtn:9torres9@cluster1-shard-00-00-gluuy.mongodb.net:27017,cluster1-shard-00-01-gluuy.mongodb.net:27017,cluster1-shard-00-02-gluuy.mongodb.net:27017/curso_mean?ssl=true&replicaSet=Cluster1-shard-0&authSource=admin";

mongoose.connect(uri, (err, res) => {
  if (err) {
    throw err;
  }else {
    console.log('La base de datos está conectada correctamente');

    app.listen(port, ()=>{
        console.log('Servidor del api REST de NodeJs escuchando en localhost:'+port);
    });
  }
});

/*MongoClient.connect(uri, (err, db) => {
  if (err) {
    throw err;
  }else {
    console.log('La base de datos está conectada correctamente');

    app.listen(port, ()=>{
      console.log('Servidor del api REST de NodeJs escuchando en localhost:'+port);
    });
  }
});
*/

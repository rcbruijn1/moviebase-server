var express = require('express'),
    _       = require('lodash'),
    config  = require('../config'),
    jwt     = require('jsonwebtoken')
    db      = require('../db');
var app = module.exports = express.Router();

function GetMoviesOffsetCount(data, done) {
  db.get().query('SELECT * FROM film WHERE film_id > ' + data[0] + ' LIMIT ' + data[1], function(err, rows, fields) {
    if (err) throw err;
    done(rows);
  });
}

function GetAllMovies(done) {
  db.get().query('SELECT * FROM film', function(err, rows, fields) {
    if (err) throw err;
    done(rows);
  });
}

function GetOneMovie(id, done) {
  db.get().query('SELECT * FROM film WHERE film_id = ' + id, function(err, rows, fields) {
    if (err) throw err;
    done(rows);
  })
}

app.get('/api/v1/films', function(req, res) {
  //IF NO PARAMETERS ARE GIVEN RETURN ALL MOVIES (/api/v1/films)
  if (!req.query.offset && !req.query.count) {
    GetAllMovies(function(films){
      res.status(200).send({result : films});
    });

  //ELSE IF SOMEONE IS TRYING TO ADD PARAMETERS BUT DON'T MATCH :offset AND :count
  //THEN RETURN THE RECOMMENDED USAGE OF API CALL. IN THIS CASE /api/v1/films?offset=(start)&count=(aantal)
  } else if (!req.query.offset | !req.query.count) {
    return res.status(400).send("/api/v1/films?offset=(start)&count=(aantal)");
  }
  //IF OFFSET AND COUNT PARAMETERS ARE FINE, THEN RETURN THE REQUESTED MOVIES
  else if (req.query.offset && req.query.count) {

    var data = [req.query.offset, req.query.count]
    GetMoviesOffsetCount(data, function(films){
      res.status(200).send({result : films});
    });
  }
});

app.get('/api/v1/films/:filmid', function (req,res) {
    if (isNaN(req.params.filmid)) {
      return res.status(400).send("You must fill in a film ID")}

      GetOneMovie(req.params.filmid, function (film) {
        return res.status(200).send({result : film});

      })




})
/**
 * Created by Ruben on 15-6-2017.
 */
var express = require('express');
var routes = express.Router();
var db = require('../config/db');


routes.get('/movies', function(req, res) {
    res.contentType('application/json');

    db.query('SELECT * FROM film', function(error, rows, fields) {
        if (error) {
            res.status(401).json(error);
        } else {
            res.status(200).json({ result: rows });
        };
    });
});

module.exports = routes;
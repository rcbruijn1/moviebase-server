/**
 * Created by Ruben on 15-6-2017.
 */
var express = require('express');
var routes = express.Router();

var jsonObject1 = {
    tekst: "Dit is een JSON"
};

var jsonObject2 = {
    tekst: "Nog een JSON?"
};

routes.get('/hello', function (req, res) {
    res.contentType('application/json');
    res.status(200);
    res.json(jsonObject1);
});

routes.get('/goodbye', function (req, res) {
    res.contentType('application/json');
    res.status(200);
    res.json(jsonObject2);
});

module.exports = routes;
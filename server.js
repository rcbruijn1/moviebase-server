var http = require('http');
var express = require('express');
var routes_v1 = require ('./api/routes_v1');
var config = require('./config/config');
var db = require('./config/db');


var app = express();

app.use('/api/v1', routes_v1);

app.set('port', (process.env.PORT | config.webPort));
app.set('env', (process.env.ENV | 'development'))



app.listen(process.env.PORT ||8080, function () {
    console.log('De server luistert op port 8080');
});
module.exports = app;



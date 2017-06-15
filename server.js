var http = require('http');
var express = require('express');
var routes_v1 = require ('./api/routes_v1');


var app = express();

app.use('/api/v1', routes_v1);



app.listen(process.env.PORT ||8080, function () {
    console.log('De server luistert op port 8080');
});
module.exports = app;



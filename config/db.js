/**
 * Created by Ruben on 16-6-2017.
 */
var mysql = require('mysql');
var config = require('../config/config');

var connectionSettings = {
    host: '146.185.130.82',
    user: '1011',
    password: '1234',
    database: '1011',
    debug: false
}

var connection = mysql.createConnection(connectionSettings);

connection.connect(function(error) {
    if (error) {
        console.error("Error connecting to database " + connectionSettings.database + " on " + connectionSettings.host + ": " + error.message);
        return;
    } else {
        console.log("Connected to database " + connectionSettings.database + " on " + connectionSettings.host);
    }
});

module.exports = connection;
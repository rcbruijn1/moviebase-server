/**
 * Created by Ruben on 16-6-2017.
 */
var mysql = require('mysql');
var config = require('../config/config');

var connectionSettings = ({
    host: config.dbHost,
    user: config.dbUser,
    password: config.dbPass,
    database: config.dbDatabase,
    debug: false
});

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
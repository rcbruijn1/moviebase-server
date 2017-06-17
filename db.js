/**
 * Created by Ruben on 16-6-2017.
 */
var mysql = require('mysql');
var config = require('./config');

var pool  = null;
exports.connect = function() {
    pool = mysql.createPool({
        host: process.env.DB_HOST || config.dbHost,
        user: process.env.DB_USER || config.dbUser,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE || config.dbDatabase,
    });
}
exports.get = function() {
    return pool;
}

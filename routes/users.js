var express = require('express'),
    _ = require('lodash'),
    config = require('../config'),
    jwt = require('jsonwebtoken')
db = require('../db');
var app = module.exports = express.Router();
var secretKey = "RBDB";

function createToken(user) {
    return jwt.sign(_.omit(user, 'password'), config.secretKey, {expiresIn: 60 * 60 * 5});
}


function getUserDB(username, done) {
    db.get().query('SELECT * FROM customer WHERE username = ? LIMIT 1', [username], function (err, rows, fields) {
        if (err) throw err;
        done(rows[0]);
    });
}


// GET Request om alle customers die zijn geregistreerd op te halen
function getAllUsersDB(done) {
    db.get().query('SELECT * FROM customer', function (err, rows, fields) {
        if (err) throw err;
        done(rows);
    });
}



app.get('/api/v1/user', function (req, res) {
    getAllUsersDB(function (rows) {
        res.status(200).send({result: rows});
    })
});


// Geeft informatie over de customer mee bij het inloggen
function getSingleUsersDB(singleName,done) {
    db.get().query('SELECT * FROM customer WHERE username = "' + singleName + ' "'
        , function (err, rows, fields) {
        if (err) throw err;
        done(rows);
    });
}

app.post('/api/v1/login/:username', function (req, res) {
    getSingleUsersDB(req.params.username, function (test) {
        res.status(200).send({result:test});
    })

});

//Functie om een nieuwe user te registreren

app.post('/api/v1/register', function (req, res) {
    if (!req.body.username || !req.body.password) {
        return res.status(400).send("You must send the username and the password");
    }
    getUserDB(req.body.username, function (user) {
        if (!user) {
            user = {
                username: req.body.username,
                password: req.body.password,
                first_name: req.body.firstName,
                last_name: req.body.lastName,
                email: req.body.email

            };
            db.get().query('INSERT INTO customer SET ?', [user], function (err, result) {
                if (err) throw err;
                newUser = {
                    id: result.insertId,
                    username: user.username,
                    password: user.password,
                    firstName: user.first_name,
                    email: user.email
                };
                res.status(201).send({
                    id_token: createToken(newUser)
                });
            });
        }
        else res.status(400).send("A user with that username already exists");
    });
});


// Twee functies om een in te loggen, waarin de username & password worden opgehaald en gecheckt
app.post('/api/v1/login', function (req, res) {
    if (!req.body.username || !req.body.password) {
        return res.status(400).send("You must send the username and the password");
    }
    getUserDB(req.body.username, function (user) {
        if (!user) {
            return res.status(402).send("The username is not existing");
        }
        if (user.password !== req.body.password) {
            return res.status(401).send("The username or password don't match");
        }
        getSingleUsersDB(req.body.username, function (user) {
            res.status(201).send({
                result : user,
                id_token: createToken(user)

            });
        })

    });
});
app.get('/user/check/:username', function (req, res) {
    if (!req.params.username) {
        return res.status(400).send("You must send a username");
    }
    getUserDB(req.params.username, function (user) {
        if (!user) res.status(201).send({username: "OK"});
        else res.status(400).send("A user with that username already exists");
    });
});

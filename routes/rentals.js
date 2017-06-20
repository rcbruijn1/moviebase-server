/**
 * Created by Ruben on 18-6-2017.
 */
var express = require('express'),
    _ = require('lodash'),
    config = require('../config'),
    jwt = require('express-jwt')
db = require('../db');
var app = module.exports = express.Router();

var jwtCheck = jwt({
    secret: config.secretKey
});

//Alle request in de route rentals zijn voorzien van een JWT authenticatie
// GET Request die alle films op die op het moment worden verhuurd

function GetRentals(id, done) {
    db.get().query('SELECT film.title, film.description, rental.customer_id, rental.inventory_id  FROM rental INNER JOIN inventory ON rental.inventory_id=inventory.inventory_id INNER JOIN film ON inventory.film_id=film.film_id WHERE rental_id >= 1 ', function (err, rows, fields) {
        if (err) throw err;
        done(rows);
    });
}

app.use('/api/v1/rentals/', jwtCheck);

app.get('/api/v1/rentals/', function (req, res) {

    GetRentals(req.params.customerid, function (rental) {
        return res.status(200).send({result: rental});

    })
});

//POST Request waarmee een nieuwe rental kan worden gedaan

function MakeNewRental(userId, inventoryId, done) {
    db.get().query('INSERT INTO rental (rental_date, inventory_id, customer_id,staff_id,last_update) VALUES (2016/01/01,' + inventoryId + ',' + userId + ', 1, CURRENT_TIMESTAMP)',
        function (err, rows, fields) {
            if (err) throw err;
            done(rows);

        });
}


app.post('/api/v1/rentals/:customerid/:inventoryid', function (req, res) {
    if (isNaN(req.params.customerid) && isNaN(req.params.inventoryid)) {
        return res.status(400).send("You must fill in a customer id followed by a / and an inventoryid")
    }


    MakeNewRental(req.params.customerid, req.params.inventoryid, function (rent) {
        return res.status(200).send({result: rent});

    })
});


//Delete Request waarmee een rental "ingeleverd" kan worden.

function DeleteRental(user, inventory, done) {
    db.get().query('DELETE FROM rental WHERE customer_id = ' + user + ' AND inventory_id = ' + inventory, function (err, rows, fields) {
        if (err) throw err;
        done(rows);

    });
}

app.delete('/api/v1/rentals/:customerid/:inventoryid', function (req, res) {
    if (isNaN(req.params.customerid) && isNaN(req.params.inventoryid)) {
        return res.status(400).send("You must fill in a customer id followed by a / and an inventoryid")
    }


    DeleteRental(req.params.customerid, req.params.inventoryid, function () {
        return res.status(200).send("Rental succesfully deleted!");

    })
});

//PUT Request waarmee een bestaande rental omgezet kan worden in een andere film bij dezelfde customer

function EditRental(inventoryId, rentalId, done) {
    db.get().query('UPDATE rental SET inventory_id = ' + inventoryId + ' WHERE rental_id = ' + rentalId, function (err, rows, fields) {
        if (err) throw err;
        done(rows);

    });
}

app.put('/api/v1/rentals/:inventoryid/:rentalid', function (req, res) {
    if (isNaN(req.params.inventoryid) && isNaN(req.params.rentalid)) {
        return res.status(400).send("You must fill in the new inventory id followed by a / + the customer id")
    }


    EditRental(req.params.inventoryid, req.params.rentalid, function (re) {
        return res.status(200).send({result: re});

    });
});
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

function GetRentals(customerId, done) {
    db.get().query('SELECT film.title, film.description, rental.customer_id, rental.inventory_id, rental.rental_id  FROM rental INNER JOIN inventory ON rental.inventory_id=inventory.inventory_id INNER JOIN film ON inventory.film_id=film.film_id WHERE is_rented = 1 AND rental_id >= 1 AND customer_id = ' + customerId, function (err, rows, fields) {
        if (err) throw err;
        done(rows);
    });
}

app.use('/api/v1/rentals/', jwtCheck);

app.get('/api/v1/rentals/:customerId', function (req, res) {

    GetRentals(req.params.customerId, function (rental) {
        return res.status(200).send({result: rental});

    })
});

//POST Request waarmee een nieuwe rental kan worden gedaan

function MakeNewRental(customerId, inventoryId, done) {
    db.get().query('INSERT INTO rental (rental_date, inventory_id, customer_id,staff_id,last_update) VALUES (2016/01/01,' + inventoryId + ',' + customerId + ', 1, CURRENT_TIMESTAMP)',
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



//PUT Request waarmee een bestaande rental kan worden teruggebracht.

function ReturnRental(rentalid, done) {
    db.get().query('UPDATE rental SET is_rented = 0  WHERE rental_id = ' + rentalid, function (err, rows, fields) {
        if (err) throw err;
        done(rows);

    });
}

app.put('/api/v1/rentals/:rentalid', function (req, res) {
    if (isNaN(req.params.rentalid)) {
        return res.status(400).send("You must fill in a rental id to return")
    }


    ReturnRental(req.params.rentalid, function (returned) {
        return res.status(200).send({result: returned});

    });
});
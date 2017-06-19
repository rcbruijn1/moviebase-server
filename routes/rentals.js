/**
 * Created by Ruben on 18-6-2017.
 */
var express = require('express'),
    _       = require('lodash'),
    config  = require('../config'),
    jwt     = require('express-jwt')
db      = require('../db');
var app = module.exports = express.Router();

var  jwtCheck = jwt({
    secret: config.secretKey
});

function GetUserRental(id, done) {
    db.get().query('SELECT * FROM rental WHERE customer_id = ' + id, function(err, rows, fields) {
        if (err) throw err;
        done(rows);
    });
}

app.use('/api/v1/rentals/', jwtCheck);

app.get('/api/v1/rentals/:customerid', function (req,res) {
    if (isNaN(req.params.customerid)) {
        return res.status(400).send("You must fill in a customer id")}

    GetUserRental(req.params.customerid, function (rental) {
        return res.status(200).send({result : rental});

    })
});


function PostUserRental(userId, inventoryId, done) {
    db.get().query('INSERT INTO rental (rental_date, inventory_id, customer_id,staff_id,last_update) VALUES (2016/01/01,' + inventoryId + ',' + userId + ', 1, CURRENT_TIMESTAMP)',
        function (err, rows,fields) {
        if (err) throw err;
        done(rows);

    });
}




app.post('/api/v1/rentals/:customerid/:inventoryid', function (req,res) {
    if (isNaN(req.params.customerid) && isNaN(req.params.inventoryid)){
        return res.status(400).send("You must fill in a customer id followed by a / and an inventoryid")}
    

        PostUserRental(req.params.customerid, req.params.inventoryid, function (rent) {
            return res.status(200).send({result : rent});

        })
    });

function DeleteRental(user, inventory, done) {
    db.get().query('DELETE FROM rental WHERE customer_id = ' + user + ' AND inventory_id = ' + inventory, function (err, rows,fields) {
            if (err) throw err;
            done(rows);

        });
}

app.delete('/api/v1/rentals/:customerid/:inventoryid', function (req,res) {
    if (isNaN(req.params.customerid) && isNaN(req.params.inventoryid)){
        return res.status(400).send("You must fill in a customer id followed by a / and an inventoryid")}


    DeleteRental(req.params.customerid, req.params.inventoryid, function () {
        return res.status(200).send("Rental succesfully deleted!");

    })
});

function ChangeRental(inventoryId, customerId, done) {
    db.get().query('UPDATE rental SET inventory_id = ' + inventoryId + ' WHERE customer_id = ' + customerId, function (err, rows,fields) {
        if (err) throw err;
       done(rows);

    });
}

app.put('/api/v1/rentals/:inventoryid/:customerid', function (req,res) {
    if (isNaN(req.params.inventoryid) && isNaN(req.params.customerid)){
        return res.status(400).send("You must fill in the new inventory id followed by a / + the customer id")}


    ChangeRental(req.params.inventoryid, req.params.customerid, function(re){
        return res.status(200).send({result : re});

    });
});
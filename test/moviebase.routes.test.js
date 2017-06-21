/**
 * Created by Ruben on 21-6-2017.
 */

var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../app');
var chould = chai.should();
var token = require('jsonwebtoken');

var user = {
    username: "bobby",
    password: "blue"
}


chai.use(chaiHttp);

describe('POST /api/v1/login', function() {


        it('should return customer details and a token', function(done) {
            chai.request(server)

            .post('/api/v1/login')
            .send(user)
            .end(function(err, res) {
                res.body.should.be.a('object');
                token = res.body.token;
                done();
            });
    });})


describe('GET /api/v1/films', function() {

    it('should return all films when logged in', function(done) {
        chai.request(server)
            .get('/api/v1/films')
            .end(function(err, res) {console.dir(err);
             res.body.should.be.a('object');
             done();
            });
    });



});

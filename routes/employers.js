var express = require('express');
var router = express.Router();
var Employer = require('./../app/models/employer');

router.get('/', function (req, res) {
    var urlBase = req.protocol + '://' + req.get('host');
    
    Employer.find(function(err, results) {
        if(err) {
            throw err;
        }
        var employers = results.map(function(employer) {
            var transformed = employer.toObject();
            transformed.url = urlBase + transformed.url;
            delete transformed._id;
            return transformed;
        });
        res.send(employers);
    });
});

router.get('/:id', function(req, res) {
    var urlBase = req.protocol + '://' + req.get('host')
    Employer.findById(req.params.id, function(err, doc) {
        if(err) {
            throw err;
        }
        var transformed = doc.toObject();
        transformed.url = urlBase + transformed.url;
        res.send(transformed);
    });
});

module.exports = router;
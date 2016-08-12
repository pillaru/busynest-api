var express = require('express');
var router = express.Router();

router.get('/', function (req, res) {
    var urlBase = req.protocol + '://' + req.get('host')
    var employers = [
        {
            "id": 1,
            "url": urlBase + "/employers/1234",
            "name": "NHS",
            "address_line_1": "2 Simple Street",
            "address_line_2": "Great Lever",
            "town_or_city": "Bolton",
            "county": "Lancashire",
            "country": "United Kingdom",
            "postcode": "BL3 2JN"
        }
    ];
    res.send(employers);
});

router.get('/:id', function(req, res) {
    var urlBase = req.protocol + '://' + req.get('host')
    var employer = {
        "id": 1,
        "url": urlBase + "/employers/1234",
        "name": "NHS",
        "address_line_1": "2 Simple Street",
        "address_line_2": "Great Lever",
        "town_or_city": "Bolton",
        "county": "Lancashire",
        "country": "United Kingdom",
        "postcode": "BL3 2JN"
    };
    res.send(employer);
});

module.exports = router;

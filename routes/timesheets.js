var express = require('express');
var router = express.Router();

router.get('/', function (req, res) {
    var urlBase = req.protocol + '://' + req.get('host')
    var timesheets = [
        {
            "id": 1,
            "url": urlBase + "/timesheets/1",
            "entries_url": urlBase + "/timesheets/1/entries", 
            "submit_date": "2016-08-12T19:11:12.113Z"
        }
    ]
    res.send(timesheets);
});

router.get('/:id/entries', function(req, res) {
    var urlBase = req.protocol + '://' + req.get('host')    
    var entries = [
        {
            "id": 1234,
            "url": urlBase + "/timesheets/1/entries/1234",
            "start": "2016-08-12T19:22:31.472Z",
            "end": "2016-08-12T19:22:31.472Z",
            "break": 0.5,
            "rate_per_hour": 8.5,
            "employer": {
                "id": 123,
                "url": urlBase + "/employers/123",
                "name": "NHS",
                "address_line_1": "2 Simple Street",
                "address_line_2": "Great Lever",
                "town_or_city": "Bolton",
                "county": "Lancashire",
                "country": "United Kingdom",
                "postcode": "BL3 2JN"
            }
        }
    ]
    res.send(entries);
});

module.exports = router;

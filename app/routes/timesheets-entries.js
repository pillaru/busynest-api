var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
    var urlBase = req.protocol + '://' + req.get('host')    
    var entries = [
        {
            "id": 1234,
            "url": urlBase + "/timesheet-entries/1234",
            "start": "2016-08-12T19:22:31.472Z",
            "end": "2016-08-12T19:22:31.472Z",
            "break": 0.5,
            "rate_per_hour": 8.5
        }
    ]
    res.send(entries);
});

module.exports = router;

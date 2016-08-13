var express = require('express'),
    router = express.Router(),
    timesheetEntryService = require('./../services/timesheet-entry-service');

router.get('/', function(req, res) {
    timesheetEntryService.find(req).then(function(entries){
        res.send(entries);
    }).catch(function(reason){
        console.log(reason);
        res.sendStatus(500);
    });
});

router.post('/', function(req, res) {
    req.checkBody('start', 'Start is required').notEmpty();
    req.checkBody('end', 'End is required').notEmpty();
    req.checkBody('break', 'Break is required').notEmpty();
    req.checkBody('rate_per_hour', 'Rate Per Hour is required').notEmpty();

    timesheetEntryService.create({
        start: req.body.start,
        end: req.body.end,
        break: req.body.break,
        rate_per_hour: req.body.rate_per_hour
    }, req).then(function(entry) {
        res.send(entry);
    }).catch(function(reason){
        console.log(reason);
        res.sendStatus(500);
    });
});

module.exports = router;

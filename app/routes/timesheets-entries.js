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
    req.checkBody('employer_office.id', 'Employer\'s office identifier is required').notEmpty();
    req.checkBody('start', 'Start is required').notEmpty();
    req.checkBody('end', 'End is required').notEmpty();
    req.checkBody('break', 'Break is required').notEmpty();
    req.checkBody('rate_per_hour', 'Rate Per Hour is required').notEmpty();

    var errors = req.validationErrors();
    if (errors) {
        res.status(400).json(errors);
        return;
    }

    timesheetEntryService.create({
        employer_office: { 
            id : req.body.employer_office.id 
        },
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

router.get('/:id', function(req, res) {
    timesheetEntryService.findById(req.params.id, req).then(function(entry) {
        res.send(entry);
    }).catch(function(reason) {
        console.log(reason);
        res.sendStatus(500);
    });
});

module.exports = router;

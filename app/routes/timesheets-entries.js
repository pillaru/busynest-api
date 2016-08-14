const express = require('express');
const timesheetEntryService = require('./../services/timesheet-entry-service');

const router = express.Router();

router.get('/', (req, res) => {
    timesheetEntryService.find(req).then((entries) => {
        res.send(entries);
    }).catch((reason) => {
        console.log(reason);
        res.sendStatus(500);
    });
});

router.post('/', (req, res) => {
    req.checkBody('employer_office.id', 'Employer\'s office identifier is required').notEmpty();
    req.checkBody('start', 'Start is required').notEmpty();
    req.checkBody('end', 'End is required').notEmpty();
    req.checkBody('break', 'Break is required').notEmpty();
    req.checkBody('rate_per_hour', 'Rate Per Hour is required').notEmpty();

    const errors = req.validationErrors();
    if (errors) {
        res.status(400).json(errors);
        return;
    }

    timesheetEntryService.create({
        employer_office: {
            id: req.body.employer_office.id
        },
        start: req.body.start,
        end: req.body.end,
        break: req.body.break,
        rate_per_hour: req.body.rate_per_hour
    }, req).then((entry) => {
        res.send(entry);
    }).catch((reason) => {
        console.log(reason);
        res.sendStatus(500);
    });
});

router.get('/:id', (req, res) => {
    timesheetEntryService.findById(req.params.id, req).then((entry) => {
        res.send(entry);
    }).catch((reason) => {
        console.log(reason);
        res.sendStatus(500);
    });
});

module.exports = router;

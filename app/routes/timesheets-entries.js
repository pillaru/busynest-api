const express = require('express');
const timesheetEntryService = require('./../services/timesheet-entry-service');
var stormpath = require('express-stormpath');

const router = express.Router();

router.get('/', stormpath.getUser, (req, res) => {
    timesheetEntryService.find(req).then((entries) => {
        res.send(entries);
    }).catch((reason) => {
        console.log(reason);
        res.sendStatus(500);
    });
});

router.post('/', stormpath.getUser, (req, res) => {
    req.checkBody('employerOffice.id', 'Employer\'s office identifier is required').notEmpty();
    req.checkBody('start', 'Start is required').notEmpty();
    req.checkBody('end', 'End is required').notEmpty();
    req.checkBody('break', 'Break is required').notEmpty();
    req.checkBody('ratePerHour', 'Rate Per Hour is required').notEmpty();

    const errors = req.validationErrors();
    if (errors) {
        res.status(400).json(errors);
        return;
    }

    var userId = getUserId(req);
    timesheetEntryService.create({
        employerOffice: {
            id: req.body.employerOffice.id
        },
        userId: userId,
        start: req.body.start,
        end: req.body.end,
        break: req.body.break,
        ratePerHour: req.body.ratePerHour
    }, req).then((entry) => {
        res.send(entry);
    }).catch((reason) => {
        console.log(reason);
        res.sendStatus(500);
    });
});

router.get('/:id', stormpath.getUser, (req, res) => {
    timesheetEntryService.findById(req.params.id, req).then((entry) => {
        if(entry === null) {
            res.sendStatus(404);
            return;
        }
        var userId = getUserId(req);
        if(entry.userId !== userId) {
            res.sendStatus(403);
            return;
        }
        res.send(entry);
    }).catch((reason) => {
        console.log(reason);
        res.sendStatus(500);
    });
});

router.delete('/:id', stormpath.getUser, (req, res) => {
    timesheetEntryService.findById(req.params.id, req).then((entry) => {
        if(entry === null) {
            res.sendStatus(404);
            return;
        }
        var userId = getUserId(req)
        if(entry.userId !== userId) {
            res.sendStatus(403);
            return;
        }
        timesheetEntryService.remove(req.params.id, req).then(() => {
            res.sendStatus(204);
        });
    }).catch((reason) => {
        console.log(reason);
        res.sendStatus(500);
    });
});

function getUserId(req) {
    return req.user.href.substr(req.user.href.lastIndexOf('/') + 1);
}

module.exports = router;

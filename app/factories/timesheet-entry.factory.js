var officeFactory = require('./office.factory'),
    orgFactory = require('./organization.factory');

function create(entry, urlBase) {
    entry.url = urlBase + '/timesheet-entries/'+entry.id;
    delete entry._id;
    if (entry.employerOffice) {
        entry.employerOffice = officeFactory.create(entry.employerOffice, urlBase);
    }
    return entry;
}

module.exports = {
    create: create
};

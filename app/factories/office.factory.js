var orgFactory = require('./organization.factory');

function create(office, urlBase) {
    office.url = urlBase + office.url;
    delete office._id;
    if(office.organization) {
        office.organization = orgFactory.create(office.organization, urlBase);
    }
    return office;
}

module.exports = {
    create: create
}

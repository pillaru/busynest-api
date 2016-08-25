function create(organization, urlBase) {
    organization.url = urlBase + '/organizations/'+organization.id;
    organization.offices = {
        url: urlBase + '/organizations/'+organization.id+'/offices'
    }
    delete organization._id;
    return organization;
}

module.exports = {
    create: create
}

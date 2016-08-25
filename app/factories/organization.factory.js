function create(organization, urlBase) {
    organization.url = urlBase + organization.url;
    organization.offices = {
        url: urlBase + organization.offices.url
    }
    delete organization._id;
    return organization;
}

module.exports = {
    create: create
}

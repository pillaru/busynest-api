function create(model, urlBase) {
    model.url = urlBase + model.url;
    model.offices = {
        url: urlBase + model.offices.url
    }
    delete model._id;
    return model;
}

module.exports = {
    create: create
}

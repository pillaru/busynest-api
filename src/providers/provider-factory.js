const MongoDbProviderFactory = require("./mongodb-provider-factory");
const Auth0ApiServiceProviderFactory = require("./auth0-api-service-provider-factory");

const cachedDb = null;

function providerFactory(resource) {
    if (resource === "/users") {
        return new Auth0ApiServiceProviderFactory();
    }
    return new MongoDbProviderFactory(cachedDb);
}

module.exports = providerFactory;

const Auth0ApiServiceProvider = require('./auth0-api-service-provider');

class Auth0ApiServiceProviderFactory {

    create() {
        return new Auth0ApiServiceProvider();
    }

}

module.exports = Auth0ApiServiceProviderFactory;

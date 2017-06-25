const httpClient = require('../helpers/http-client');
const querystring = require('querystring');

class Auth0ApiServiceProvider {

    getAll(filter, limit, offset) {
        const postData = JSON.stringify({
            client_id: process.env.AUTH0_CLIENT_ID,
            client_secret: process.env.AUTH0_CLIENT_SECRET,
            audience: 'https://bizhub.eu.auth0.com/api/v2/',
            scope: 'read:users',
            grant_type: 'client_credentials'
        });

        return httpClient.post('https://bizhub.eu.auth0.com/oauth/token', postData)
        .then((response) => {
            const token = response.body.access_token;
            const qs = {
                include_totals: true,
                page: Math.floor(offset / limit),
                per_page: limit
            };
            const href = 'https://bizhub.eu.auth0.com/api/v2/users';
            return httpClient.get(`${href}?${querystring.stringify(qs)}`, {
                Authorization: `Bearer ${token}`
            });
        })
        .then((response) => ({ totalSize: response.body.total, content: response.body.users }))
        .catch((err) => {
            console.log(err);
        });
    }
}

module.exports = Auth0ApiServiceProvider;

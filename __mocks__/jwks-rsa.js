const jwksClient = require("jwks-rsa");

function getSigningKey(kid, cb) {
    cb(new Error(), "signing_key");
}

jwksClient.getSigningKey = getSigningKey;

module.exports = jwksClient;

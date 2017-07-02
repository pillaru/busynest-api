const jwksClient = require('jwks-rsa');
const jwt = require('jsonwebtoken');
const Raven = require('raven');

const AUDIENCE = 'https://bizhub-api/';
const ISSUER = ['https://bizhub.eu.auth0.com/'];
const algorithms = ['RS256'];
const JWKS_URI = 'https://bizhub.eu.auth0.com/.well-known/jwks.json';

Raven.config(process.env.SENTRY_DSN).install();

const logError = (err) => {
    console.log(err);
    Raven.captureException(err);
};

// Policy helper function
const generatePolicy = (principalId, effect, resource) => {
    const authResponse = {
        principalId: principalId.split('|')[1],
        // pass additional values here
        // available in $event.requestContext.authorizer.key
        context: { }
    };
    if (effect && resource) {
        const policyDocument = {};
        policyDocument.Version = '2012-10-17';
        policyDocument.Statement = [];
        const statementOne = {};
        statementOne.Action = 'execute-api:Invoke';
        statementOne.Effect = effect;
        statementOne.Resource = resource;
        policyDocument.Statement[0] = statementOne;
        authResponse.policyDocument = policyDocument;
    }
    return authResponse;
};

function authorize(event, context, cb) {
    if (event.authorizationToken) {
        // remove "bearer " from token
        const token = event.authorizationToken.substring(7);

        const client = jwksClient({
            cache: true,
            rateLimit: true,
            jwksRequestsPerMinute: 10, // Default value
            jwksUri: JWKS_URI
        });
        const decodedToken = jwt.decode(token, { complete: true });
        if (!decodedToken) {
            cb('Unauthorized');
            return;
        }
        const kid = decodedToken.header.kid;
        client.getSigningKey(kid, (err, key) => {
            if (err) {
                logError(err);
                cb('Unauthorized');
            } else {
                const signingKey = key.publicKey || key.rsaPublicKey;
                const options = {
                    algorithms,
                    audience: AUDIENCE,
                    issuer: ISSUER
                };
                jwt.verify(token, signingKey, options, (error, decoded) => {
                    if (error) {
                        logError(error);
                        cb('Unauthorized');
                    } else {
                        cb(null, generatePolicy(decoded.sub, 'Allow', event.methodArn));
                    }
                });
            }
        });
    } else {
        cb('Unauthorized');
    }
}

module.exports = {
    authorize: (event, context, cb) => {
        try {
            authorize(event, context, cb);
        } catch (e) {
            Raven.captureException(e);
            throw e;
        }
    }
};

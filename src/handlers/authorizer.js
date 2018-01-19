const jwksClient = require("jwks-rsa");
const jwt = require("jsonwebtoken");

const AUDIENCE = "https://busynest-api/";
const ISSUER = ["https://busynest.eu.auth0.com/"];
const algorithms = ["RS256"];
const JWKS_URI = "https://busynest.eu.auth0.com/.well-known/jwks.json";

const logError = (err) => {
    console.log(err);
};

const resources = [
    "GET/time-entries",
    "POST/time-entries",
    "POST/organizations",
    "DELETE/organizations/{id}",
    "POST/offices",
    "POST/invoices",
    "GET/invoices",
    "GET/invoices/{id}",
    "GET/me/organizations"
];

// Policy helper function
const generatePolicy = (principalId, effect, resource) => {
    const authResponse = {
        principalId: principalId.split("|")[1],
        // pass additional values here
        // available in $event.requestContext.authorizer.key
        context: { }
    };
    if (effect && resource) {
        const policyDocument = {};
        policyDocument.Version = "2012-10-17";
        policyDocument.Statement = [];
        const statementOne = {};
        statementOne.Action = "execute-api:Invoke";
        statementOne.Effect = effect;
        statementOne.Resource = resources.map((r) => {
            const tokens = resource.split("/", 3);
            tokens[2] = r;
            return tokens.join("/");
        });
        policyDocument.Statement[0] = statementOne;
        authResponse.policyDocument = policyDocument;
    }
    return authResponse;
};

function authorize(event, context, cb) {
    if (event.authorizationToken) {
        // remove "bearer " from token
        const token = event.authorizationToken.substring(7);

        const decodedToken = jwt.decode(token, { complete: true });
        if (!decodedToken) {
            cb("Unauthorized");
            return;
        }
        const { kid } = decodedToken.header;
        const client = jwksClient({
            cache: true,
            rateLimit: true,
            jwksRequestsPerMinute: 10, // Default value
            jwksUri: JWKS_URI
        });
        client.getSigningKey(kid, (err, key) => {
            if (err) {
                logError(err);
                cb("Unauthorized");
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
                        cb("Unauthorized");
                    } else {
                        const response = generatePolicy(decoded.sub, "Allow", event.methodArn);
                        console.log(response.policyDocument.Statement);
                        cb(null, response);
                    }
                });
            }
        });
    } else {
        cb("Unauthorized");
    }
}

module.exports = {
    authorize
};

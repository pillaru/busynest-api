const jwt = jest.genMockFromModule("jsonwebtoken");

function decode(token) {
    if (token === "token") {
        return {
            header: {
                kid: "blah"
            }
        };
    }
    return null;
}

jwt.decode = jest.fn(decode);

module.exports = jwt;

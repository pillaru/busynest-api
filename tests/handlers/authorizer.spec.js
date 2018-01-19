const handler = require("../../src/handlers/authorizer");

describe("authorizer", () => {
    describe("returns unauthorized response", () => {
        it("if event doesnt contain authorization token", (done) => {
            handler.authorize({}, {}, (response) => {
                expect(response).toEqual("Unauthorized");
                done();
            });
        });

        it("if authorization token cannot be decoded", (done) => {
            jest.mock("jsonwebtoken");
            const event = { authorizationToken: "Bearer invalid_token" };
            handler.authorize(event, {}, (response) => {
                expect(response).toEqual("Unauthorized");
                done();
            });
        });

        xit("if jwksClient getSigningKey returns error", (done) => {
            jest.mock("jsonwebtoken");
            jest.mock("jwks-rsa");
            const event = { authorizationToken: "Bearer token" };
            handler.authorize(event, {}, (response) => {
                expect(response).toEqual("Unauthorized");
                done();
            });
        });
    });
});

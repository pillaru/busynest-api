const handler = require("../../src/handlers/authorizer");

describe("authorizer", () => {
    it("returns unauthorized if event doesnt contain authorization token", (done) => {
        handler.authorize({}, {}, (response) => {
            expect(response).toEqual("Unauthorized");
            done();
        });
    });
});

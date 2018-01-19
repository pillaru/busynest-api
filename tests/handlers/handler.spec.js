const handler = require("../../src/handlers/handler");

const providerStub = {
    create: () => Promise.resolve({})
};

describe("the handler", () => {
    describe("create function", () => {
        test("sets callbackWaitsForEmptyEventLoop to false on context", (done) => {
            const context = {};
            handler.create({}, providerStub, {}, context, () => {
                expect(context.callbackWaitsForEmptyEventLoop).toEqual(false);
                done();
            });
        });
    });
});

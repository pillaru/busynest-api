const providerFactory = require("../providers/provider-factory");

const invoiceAuthService = {
    hasCreateAccess: (auth, content) => {
        console.log(auth);
        console.log(content);
        const orgId = content.organization.id;
        const userId = auth.principalId;
        // get organization from database
        const provider = providerFactory("/organizations").create("organizations");
        return provider.getById(orgId).then((doc) => {
            if (doc.owner.id === userId) {
                return Promise.resolve(true);
            }
            return Promise.resolve(false);
        }).catch((err) => {
            if (err.statusCode === 404) {
                console.log(`Cannot find organization with id ${orgId}`);
                return Promise.resolve(false);
            }
            return Promise.reject(err);
        });
    }
};

function hasCreateAccess(resource, auth, content) {
    if (resource === "/invoices") {
        return invoiceAuthService.hasCreateAccess(auth, content);
    }
    return Promise.resolve(true);
}

module.exports = {
    hasCreateAccess
};

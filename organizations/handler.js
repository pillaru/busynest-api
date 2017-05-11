const orgService = require('./app/services/organization-service');

module.exports.get = (event, context, callback) => {
    orgService.find().then((organizations) => {
        callback(null, organizations);
    }).catch((err) => {
        console.log(err, err.stack);
        callback(new Error('[500] Internal Server Error'));
    });
};

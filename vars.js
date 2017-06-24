function getStage() {
    return '${opt:stage, self:provider.stage}';
}

function getMongoDbConnectionString() {
    const stage = getStage();
    return `\${env:bizhub_api_mongodb_connectionstring_${stage}}`;
}

module.exports.stage = getStage;
module.exports.mongodb_connection_string = getMongoDbConnectionString;

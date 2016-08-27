module.exports = {
    mongodb: {
        connectionString: process.env.MONGODB_CONNECTION_STRING
            || 'mongodb://localhost:27017/bizhub'
    }
}

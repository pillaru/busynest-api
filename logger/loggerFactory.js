var winston = require('winston');

var logger = new winston.Logger({
	exitOnError: false,
    transports: [
        new winston.transports.Console({
			colorize: true,
			handleExceptions: false,
			json: false,
            level: "debug",
        }),
    ],
});

module.exports = logger;
module.exports.stream = {
    write: function(message, encoding){
        logger.info(message.slice(0, -1));
    }
};

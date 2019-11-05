module.exports = require('pino')({
	prettyPrint: process.env.NODE_ENV === 'production' ? false : true
});
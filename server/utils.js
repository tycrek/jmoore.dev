const path = require('path');
const pino = require('pino')({
	prettyPrint: process.env.NODE_ENV === 'production' ? false : true
});

module.exports = {
	log: pino,
	path: file => path.join(__dirname, file),
	CONFIG: {
		port: 8235,
		icon: path.join(__dirname, '../client/static/favicon.ico'),
		static: path.join(__dirname, '../client/static'),
		images: path.join(__dirname, '../client/images'),
		views: path.join(__dirname, '../client/views/pages')
	},
	sass: {
		file: path.join(__dirname, '../client/sass/main.scss'),
		outputStyle: 'compressed'
	},
	http: {
		_404: '<title>404 - Page not found</title><center><br><br><h1>404 - Page not found</h1></center>',
		_500: '<title>500 - Internal server error</title><center><br><br><h1>500 - Internal server error</h1></center>'
	}
};
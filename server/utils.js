const path = require('path');

module.exports = {
	path: joinPath,
	port: 8235,
	http: {
		_404: '<title>404 - Page not found</title><center><br><br><h1>404 - Page not found</h1></center>',
		_500: '<title>500 - Internal server error</title><center><br><br><h1>500 - Internal server error</h1></center>'
	},
	sass: {
		file: joinPath('../client/sass/main.scss'),
		outputStyle: 'compressed'
	},
	static: joinPath('../client/static'),
	images: joinPath('../client/images')
};

function joinPath(file) {
	return path.join(__dirname, file);
}
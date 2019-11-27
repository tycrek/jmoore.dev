const path = require('path');
const fs = require('fs-extra');
const pino = require('pino')({
	prettyPrint: process.env.NODE_ENV === 'production' ? false : true
});

module.exports = {
	log: pino,
	CONFIG: {
		port: 8235,
		icon: joinPath('../client/static/favicon.ico'),
		static: joinPath('../client/static'),
		images: joinPath('../client/images'),
		views: joinPath('../client/views/pages'),
		upload: {
			path: joinPath('../client/upload'),
			createParentPath: true,
			abortOnLimit: true,
			auth: {
				// Change these values when deployed to server
				users: { 'username': 'password' },
				challenge: true
			}
		}
	},
	sass: {
		file: joinPath('../client/sass/main.scss'),
		outputStyle: 'compressed'
	},
	http: {
		_404: '<title>404 - Page not found</title><center><br><br><h1>404 - Page not found</h1></center>',
		_500: '<title>500 - Internal server error</title><center><br><br><h1>500 - Internal server error</h1></center>'
	},
	path: joinPath,
	getData: getData
};

function joinPath(file) {
	return path.join(__dirname, file);
}

function getData(page) {
	return new Promise((resolve, reject) => {
		let filepath = joinPath(page ? `../data/${page}.json` : '../data/main.json');
		fs.pathExists(filepath)
			.then(exists => exists ? fs.readJson(filepath) : resolve())
			.then(json => resolve(json))
			.catch(err => reject(err));
	});
}
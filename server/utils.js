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
		fonts: joinPath('../client/static/fonts'),
		views: joinPath('../client/views/pages'),
		h2PushPaths: [ // These paths will be added to the Link header for HTTP/2 Push events
			// Static
			'/css',
			'/bus.js',
			'/images/joshua-moore-1.jpg',
			'/images/jm-vancouver-bc.jpeg',
			'/images/transit-2019fall_commuter_map_web-1.jpg',

			// Site pages
			'/uses/',
			'/projects/',
			'/emby/',

			// Bus
			'/bus/',
			'/bus/macewan/',
			'/bus/uofa/',
			'/bus/nait/',
			'/bus/nait/413/',
			'/bus/uofa/414/',
			'/bus/uofa/404/',
			'/bus/macewan/401/',
			'/bus/macewan/411/',
			'/bus/macewan/413/',
			'/bus/macewan/411/saturday/',
			'/bus/macewan/411/sunday/',
		]
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
			.then((exists) => exists ? fs.readJson(filepath) : resolve())
			.then((json) => resolve(json))
			.catch((err) => reject(err));
	});
}

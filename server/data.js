const CONFIG = require('./config');
const fs = require('fs-extra');

module.exports = function (page) {
	return new Promise((resolve, reject) => {
		let path = CONFIG.path(`../data/${page}.json`);
		fs.pathExists(path)
			.then(exists => exists ? fs.readJson(path) : resolve())
			.then(json => resolve(json))
			.catch((err) => reject(err));
	})
}
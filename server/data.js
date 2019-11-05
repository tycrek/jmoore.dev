const CONFIG = require('./config');
const fs = require('fs-extra');

exports.getData = page => {
	return new Promise((resolve, reject) => {
		let path = CONFIG.path(`../data/${page}.json`);
		fs.pathExists(path)
			.then(exists => exists ? fs.readJson(path) : resolve())
			.then(json => resolve(json))
			.catch(err => reject(err));
	});
}

const mainData = require('../data/main.json');
exports.main = mainData;
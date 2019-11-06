const { path } = require('./utils');
const fs = require('fs-extra');

exports.getData = page => {
	return new Promise((resolve, reject) => {
		let filepath = path(`../data/${page}.json`);
		fs.pathExists(filepath)
			.then(exists => exists ? fs.readJson(filepath) : resolve())
			.then(json => resolve(json))
			.catch(err => reject(err));
	});
}

const mainData = require('../data/main.json');
exports.main = mainData;
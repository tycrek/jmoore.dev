// NPM Module imports
var express = require('express');
var fs = require('fs-extra');
var path = require('path');
var sass = require('node-sass');

// Set up the router
var router = express.Router();

// Preset error response just in case
router.use((_req, res, next) => {
	res.type('text');
	res.status(500);
	next();
});

// Index route
router.get('/', (_req, res) => {
	readFile('client/index.html')
		.then((html) => (res.status(200).type('html'), html))
		.catch((err) => err)
		.then((data) => res.send(data));
});

// JavaScript route
router.get('/js', (_req, res) => {
	readFile('client/jmoore.js')
		.then((js) => (res.status(200).type('js'), js))
		.catch((err) => err)
		.then((data) => res.send(data));
});

// CSS route
router.get('/css', (_req, res) => {
	readFile('client/stylesheet.scss')
		.then((scss) => renderSass(scss))
		.then((css) => (res.status(200).type('css'), css))
		.catch((err) => err)
		.then((data) => res.send(data));
});

// 404 response
router.use((_req, res, _next) => {
	res.status(404).type('text');
	res.send('404 - This is not the page you are looking for');
});

// 500 response
router.use((err, _req, res, _next) => {
	console.error(err.stack);
	res.status(500).type('text');
	res.send('500 - The server is on fire');
});

// Export router so index.js can access it
module.exports = router;

// Read files with path and buffer conversion
function readFile(filename) {
	return new Promise((resolve, reject) => {
		fs.readFile(path.join(__dirname, filename))
			.then((bytes) => bytes.toString())
			.then((data) => resolve(data))
			.catch((err) => reject(err));
	});
}

// Render SASS to CSS
function renderSass(scss) {
	return new Promise((resolve, reject) => {
		sass.render({
			data: scss,
			outputStyle: 'compressed'
		}, (err, result) => {
			if (err) reject(err);
			else resolve(result.css.toString());
		});
	});
}
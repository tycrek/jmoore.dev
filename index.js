const PORT = 8235;

// NPM Module imports
var express = require('express');
var compress = require('compression');
var helmet = require('helmet');
var fs = require('fs-extra');
var path = require('path');
var sass = require('node-sass');

// Express app setup
var app = express();
app.use(compress());
app.use(helmet({
	noCache: true,
	referrerPolicy: true
}));

// Express routes
app.get('/', (_req, res) => {
	readFile('client/index.html')
		.then((html) => {
			res.type('html');
			res.status(200);
			return html;
		})
		.catch((err) => {
			res.type('text');
			res.status(500);
			return err;
		})
		.then((data) => res.send(data));
});

app.get('/js', (_req, res) => {
	readFile('client/jmoore.js')
		.then((js) => {
			res.type('js');
			res.status(200);
			return js;
		})
		.catch((err) => {
			res.type('text');
			res.status(500);
			return err;
		})
		.then((data) => res.send(data));
});

app.get('/css', (_req, res) => {
	readFile('client/stylesheet.scss')
		.then((scss) => renderSass(scss))
		.then((css) => {
			res.type('text/css');
			res.status(200);
			return css;
		})
		.catch((err) => {
			res.type('text');
			res.status(500);
			return err;
		})
		.then((data) => res.send(data));
});

// Run Express app
app.listen(PORT, () => console.log(`Server hosted on port: ${PORT}`));

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
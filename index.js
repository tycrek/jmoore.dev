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

app.use((_req, res, next) => {
	res.type('text');
	res.status(500);
	next();
})

// Express routes
app.get('/', (_req, res) => {
	readFile('client/index.html')
		.then((html) => {
			res.status(200).type('html');
			return html;
		})
		.catch((err) => err)
		.then((data) => res.send(data));
});

app.get('/js', (_req, res) => {
	readFile('client/jmoore.js')
		.then((js) => (res.status(200).type('js'), js))
		.catch((err) => err)
		.then((data) => res.send(data));
});

app.get('/css', (_req, res) => {
	readFile('client/stylesheet.scss')
		.then((scss) => renderSass(scss))
		.then((css) => (res.status(200).type('css'), css))
		.catch((err) => err)
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
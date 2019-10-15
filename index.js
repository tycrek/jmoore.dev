const PORT = 8235;

var express = require('express');
var compress = require('compression');
var helmet = require('helmet');
var fs = require('fs-extra');
var path = require('path');
var sass = require('node-sass');

var app = express();
app.use(compress());
app.use(helmet({
	referrerPolicy: true
}));

// routes
app.use((_req, res, next) => {
	res.setHeader('Cache-Control', 'no-cache, proxy-revalidate');
	res.setHeader('Surrogate-Control', 'no-store');
	res.setHeader('Pragma', 'no-cache');
	res.setHeader('Expires', '0');

	next();
});

app.get('/', (_req, res) => {
	readFile('client/index.html')
		.then((data) => {
			res.type('html');
			res.status(200);
			return data;
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
		.then((data) => {
			res.type('js');
			res.removeHeader('X-XSS-Protection');
			res.status(200);
			return data;
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
		.then((data) => renderSass(data))
		.then((data) => {
			res.type('text/css');
			res.removeHeader('X-XSS-Protection');
			res.status(200);
			return data;
		})
		.catch((err) => {
			res.type('text');
			res.status(500);
			return err;
		})
		.then((data) => res.send(data));
});

// start
app.listen(PORT, () => console.log(`Server hosted on port: ${PORT}`));

// functions
function readFile(filename) {
	return new Promise((resolve, reject) => {
		let filepath = path.join(__dirname, filename);
		fs.readFile(filepath)
			.then((bytes) => bytes.toString())
			.then((data) => resolve(data))
			.catch((err) => reject(err));
	});
}

function renderSass(data) {
	return new Promise((resolve, reject) => {
		sass.render({ data: data }, (err, result) => {
			if (err) reject(err);
			else resolve(result.css.toString());
		});
	});
}
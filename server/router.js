const CONFIG = require('./config');
const fs = require('fs-extra');
const sass = require('node-sass');
const minify = require('@node-minify/core');
const uglify = require('@node-minify/uglify-es');
const router = require('express').Router();
const Data = require('./data');
module.exports = router;

// Compile and compress Sass
router.get('/css', (_req, res, next) => {
	let options = { file: CONFIG.path('../client/sass/main.scss'), outputStyle: 'compressed' };
	sass.render(options, (err, result) => err ? next(err) : res.type('css').send(result.css));
});

// Compress all JavaScript files using Uglify-ES
router.get('*.js', (req, res, next) => {
	fs.readFile(CONFIG.path(`../client/javascript${req.url}`))
		.then(bytes => bytes.toString())
		.then(javascript => minify({ compressor: uglify, content: javascript }))
		.then(minified => res.type('js').send(minified))
		.catch(err => next(err));
});

// All other routes
router.get('*', (req, res, next) => {
	let url = req.url;

	if (url === '/') return res.render('index', { title: Data.main.titles.index, main: Data.main });
	if (!url.endsWith('/')) return res.redirect(301, `${url}/`);

	let page = url.substring(1, url.length - 1);

	fs.pathExists(CONFIG.path(`../client/views/pages/${page}.pug`))
		.then(exists => { if (exists) return Data.getData(page); else throw next(); })
		.then(data => ({
			title: data && data.title ? data.title : Data.main.titles[page],
			main: Data.main,
			data: data
		}))
		.then(options => res.render(page, options))
		.catch(() => next());
});

// HTTP 404
router.use((_req, res) => res.status(404).send(CONFIG.http_404));

// HTTP 500
router.use((err, _req, res, _next) => {
	console.error(err.stack);
	res.status(500).send(CONFIG.http_500);
});
const { sass, http, log, path, getData } = require('./utils');
const fs = require('fs-extra');
const Sass = require('node-sass');
const minify = require('@node-minify/core');
const uglify = require('@node-minify/uglify-es');
const router = require('express').Router();
module.exports = router;

// Compile and compress Sass
router.get('/css', (_req, res, next) => {
	Sass.render(sass, (err, result) => {
		err ? next(err) : res.type('css').send(result.css);
	});
});

// Compress all JavaScript files using Uglify-ES
router.get('*.js', (req, res, next) => {
	fs.readFile(path(`../client/javascript${req.url}`))
		.then(bytes => bytes.toString())
		.then(javascript => minify({ compressor: uglify, content: javascript }))
		.then(minified => res.type('js').send(minified))
		.catch(err => next(err));
});

// All other routes
router.get('*', (req, res, next) => {
	let url = req.url, mainData, page;
	if (url !== '/' && !url.endsWith('/')) return res.redirect(301, `${url}/`);

	getData()
		.then(data => mainData = data)
		.then(() => page = url === '/' ? 'index' : url.substring(1, url.length - 1))
		.then(() => fs.pathExists(path(`../client/views/pages/${page}.pug`)))
		.then(exists => {
			if (!exists) throw Error(`Pug path for '${page}' does not exist`);
			else return getData(page);
		})
		.then(pageData => ({
			headTitle: pageData && pageData.title ? pageData.title : mainData.titles[page],
			headDescription: pageData && pageData.description ? pageData.description : mainData.descriptions[page],
			main: mainData,
			data: pageData
		}))
		.then(data => res.render(page, data))
		.catch(_err => next());
});

// HTTP 404
router.use((_req, res) => res.status(404).send(http._404));

// HTTP 500
router.use((err, _req, res, _next) => {
	log.error(err.stack);
	res.status(500).send(http._500);
});
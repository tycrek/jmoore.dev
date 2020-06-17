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
		.then((bytes) => bytes.toString())
		.then((javascript) => minify({ compressor: uglify, content: javascript }))
		.then((minified) => res.type('js').send(minified))
		.catch((err) => next(err));
});

// All other routes
router.get('*', (req, res, next) => {
	let url = req.url, mainData, page;
	if (url !== '/' && !url.endsWith('/')) return res.redirect(301, `${url}/`);

	getData()
		.then((data) => mainData = data)
		.then(() => page = url === '/' ? 'index' : url.substring(1, url.length - 1))
		.then(() => fs.pathExists(path(`../client/views/pages/${page}.pug`)))
		.then((exists) => {
			if (!exists) throw Error(`Pug path for '${page}' does not exist`);
			else return getData(page);
		})
		.catch((_err) => fs.pathExists(path(`../client/views/pages/${page}/index.pug`)))
		.then((exists) => {
			if (typeof (exists) !== 'boolean') return exists;
			if (!exists) throw Error(`Pug path for '${page}' does not exist`);
			else {
				page += '/index';
				return getData(page);
			};
		})
		.then((pageData) => ({
			headTitle: headData(pageData, 'title'),
			headDescription: headData(pageData, 'description'),
			main: mainData,
			data: pageData
		}))
		.then((data) => res.render(page, data))
		.catch((_err) => next());

	function headData(data, meta) {
		return data && data[meta] ? data[meta] : mainData[`${meta}s`][page];
	}
});

router.post('/upload', (req, res, _next) => {
	if (!req.files || Object.keys(req.files).length === 0) return res.status(400).send('No files were uploaded');

	let file = req.files.file;
	let savePath = path(`../client/uploads/${file.name}`);
	fs.pathExists(savePath)
		.then((exists) => { if (exists) throw Error('File with same name already exists.'); })
		.then(() => file.mv(savePath))
		.then(() => res.send(`Uploaded to: <a href="/files/${file.name}" download>https://jmoore.dev/files/${file.name}</a>`))
		.catch((err) => res.type('html').send(err.message));
});

router.get('/donate', (_req, res, _next) => {
	res.redirect(301, 'https://paypal.me/jmoore235');
});

router.get('/watch-later/add/:uri', (req, res, _next) => {
	let file = path('../data/watch-later.json');
	fs.readJson(file)
		.then((json) => fs.writeJson(file, (json.urls.push(decodeURIComponent(req.params.uri)), json), { spaces: '\t' }))
		.then(() => res.type('json').send({ success: true }))
		.catch((err) => res.type('json').send({ success: false, msg: err.toString() }));
});

// HTTP 404
router.use((_req, res) => res.status(404).send(http._404));

// HTTP 500
router.use((err, _req, res, _next) => {
	log.error(err.stack);
	res.status(500).send(http._500);
});

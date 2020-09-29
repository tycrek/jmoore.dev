const { sass, http, log, path, getData } = require('./utils');
const fs = require('fs-extra');
const Sass = require('node-sass');
const minify = require('@node-minify/core');
const uglify = require('@node-minify/uglify-es');
const AdmZip = require('adm-zip');
const uuid = require('uuid').v4;
const Jimp = require('jimp');
const router = require('express').Router();

var TEMP_DOWNLOADS = {};

module.exports = router;

router.use(require('express-fileupload')());

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
			isProd: process.env.NODE_ENV === 'production',
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

router.get('/watch-later/add/:uri', (req, res, _next) => {
	let file = path('../data/watch-later.json');
	fs.readJson(file)
		.then((json) => fs.writeJson(file, (json.urls.push(decodeURIComponent(req.params.uri)), json), { spaces: '\t' }))
		.then(() => res.type('json').send({ success: true }))
		.catch((err) => res.type('json').send({ success: false, msg: err.toString() }));
});

router.get('/totem/:username', (req, res, _next) => {
	let username = req.params.username;
	let mcmeta = {
		pack: {
			'pack_format': 3, // * Pack format 3 is for Minecraft 1.11 – 1.12.2
			'description': `\u00a76\u00a7l\u00a7n${username}\u00a76 \u00a76\u00a7l\u00a7nTotem\u00a7r\n\u00a77\u25b6\u00a78\u00a7o jmoore.dev\/custom-totem`
		}
	};

	let zip = new AdmZip();
	let did = uuid().split('-')[0];
	let base = `../client/downloads/${username}-totem`;

	let basePath = path(base);
	let archivePath = path(`${base}.zip`);
	let mcmetaPath = path(`${base}/pack.mcmeta`);
	let pngPath = path(`${base}/pack.png`);
	let totemPath = path(`${base}/assets/minecraft/textures/items/totem.png`);

	fs.mkdir(basePath)
		.then(() => new Promise((resolve, reject) =>
			Jimp.read(`https://minotar.net/helm/${username}/128.png`)
				.then((image) => image.writeAsync(pngPath))
				.then(() => resolve())
				.catch((err) => reject(err))
		))
		.then(() => new Promise((resolve, reject) =>
			Jimp.read(`https://minotar.net/armor/body/${username}/64.png`)
				.then((image) => {
					image.contain(64, 64, Jimp.HORIZONTAL_ALIGN_CENTER, Jimp.RESIZE_NEAREST_NEIGHBOR);
					return image.writeAsync(totemPath);
				})
				.then(() => resolve())
				.catch((err) => reject(err))
		))
		.then(() => fs.writeJson(mcmetaPath, mcmeta))
		.then(() => zip.addLocalFolder(basePath))
		.then(() => zip.writeZip(archivePath))
		.then(() => TEMP_DOWNLOADS[did] = archivePath)
		.then(() => res.type('json').send({ success: true, message: did }))
		.then(() => fs.remove(basePath))
		.catch((err) => {
			log.error(err);
			res.type('json').send({ success: false, message: err });
		});
});

router.get('/download/:did', (req, res, _next) => {
	res.download(TEMP_DOWNLOADS[req.params.did], (err) => {
		err != null && log.warn(err);
		if (res.headersSent) fs.remove(TEMP_DOWNLOADS[req.params.did]);
	});
});

// Redirects
fs.readJsonSync(path('../data/redirects.json')).forEach((redirect) => {
	router.get(`/${redirect.path}`, (_req, res, _next) => {
		res.redirect(301, redirect.url);
	});
});

// HTTP 404
router.use((_req, res) => res.status(404).send(http._404));

// HTTP 500
router.use((err, _req, res, _next) => {
	log.error(err.stack);
	res.status(500).send(http._500);
});

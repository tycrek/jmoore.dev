const CONFIG = require('./config');
const sass = require('node-sass');
const router = require('express').Router();
module.exports = router;

router.get('/css', (_req, res, next) => renderSass(res, next));
router.get(CONFIG.routes, (req, res) => renderPug(res, req.path));

// 404 & 500 codes
router.use((_req, res) => res.status(404).send(CONFIG.http_404));
router.use(errorHandler);

function errorHandler(err, _req, res, _next) {
	console.error(err.stack);
	res.status(500).send(CONFIG.http_500);
}

function renderPug(res, page) {
	if (page.endsWith('/')) page = page.substring(0, page.length - 1);
	let options = { title: CONFIG.titles[page] };
	res.render(page.substring(1), options);
}

function renderSass(res, next) {
	let options = { file: CONFIG.path('../client/sass/main.scss'), outputStyle: 'compressed' };
	sass.render(options, (err, result) => err ? next(err) : res.type('css').send(result.css));
}
const CONFIG = require('./config');

const pug = require('pug');
const sass = require('node-sass');
const router = require('express').Router();
module.exports = router;

router.get('/', (_req, res) => renderPug(res, 'index'));
router.get('/css', (_req, res, next) => renderSass(res, next));
router.get(CONFIG.routes, (req, res) => renderPug(res, req.path.split('/')[1]));

// 404 & 500 codes
router.use((_req, res) => res.status(404).send(CONFIG.http_404));
router.use(errorHandler);

function errorHandler(err, _req, res, _next) {
	console.error(err.stack);
	res.status(500).send(CONFIG.http_500);
}

function renderPug(res, page) {
	let file = CONFIG.path(`../client/views/pages/${page}.pug`);
	let options = {
		title: CONFIG.titles[page],
		moment: require('moment'),
	};
	res.render(file, options);
}

function renderSass(res, next) {
	let options = { file: CONFIG.path('../client/sass/main.scss'), outputStyle: 'compressed' };
	sass.render(options, (err, result) => err ? next(err) : res.type('css').send(result.css));
}
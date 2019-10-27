const CONFIG = require('./config');

const router = require('express').Router();
const sass = require('node-sass');
const pug = require('pug');

router.get('/', (_req, res) => renderPug(res, 'index'));
router.get('/css', (_req, res, next) => renderSass(res, next));
router.get(CONFIG.routes, (req, res) => renderPug(res, req.path.split('/')[1]));

// 404 & 500 codes
router.use((_req, res) => res.status(404).send(CONFIG.http_404));
router.use(errorHandler);

module.exports = router;

function errorHandler(err, _req, res, _next) {
	console.error(err.stack);
	res.status(500).send(CONFIG.http_500);
}

function renderPug(res, page) {
	let title = 'Test'; //TODO: Fix titles
	let body = pug.compileFile(CONFIG.path(`../client/views/pages/${page}.pug`))();
	let locals = { title: title, body: body };
	res.render('main', locals);
}

function renderSass(res, next) {
	let options = { file: CONFIG.path('../client/sass/main.scss'), outputStyle: 'compressed' };
	sass.render(options, (err, result) => err ? next(err) : res.type('css').send(result.css));
}
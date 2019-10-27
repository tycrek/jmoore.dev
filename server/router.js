const CONFIG = require('./config');

const router = require('express').Router();
const sass = require('node-sass');
const pug = require('pug');

router.get('/css', (_req, res) => renderSass(res));
router.get('/', (_req, res) => renderPug(res, 'index'));
router.get('/bus', (_req, res) => renderPug(res, 'bus'));
// 404 response
router.use((_req, res) => res.status(404).send(CONFIG.http_404));
// 500 response
router.use((err, _req, res, _next) => (console.error(err.stack), res.status(500).send(CONFIG.http_500)));

module.exports = router;

function renderPug(res, page) {
	let title = 'Test'; //TODO: Fix titles
	let body = pug.compileFile(CONFIG.path(`../client/views/pages/${page}.pug`))();
	let locals = { title: title, body: body };
	res.render('main', locals);
}

function renderSass(res) {
	sass.render({
		file: CONFIG.path('../client/sass/main.scss'),
		outputStyle: 'compressed'
	}, (err, result) => {
		if (err) throw new err;
		else res.type('css').send(result.css.toString());
	});
}
const CONFIG = require('./config');

const router = require('express').Router();
const sass = require('node-sass');
const pug = require('pug');

router.get('/', (_req, res) => renderPug(res, 'index'));
router.get('/css', (_req, res) => renderSass(res));
router.get(CONFIG.routes, (req, res) => renderPug(res, req.path.split('/')[1]));

// 404 & 500 codes
router.use((_req, res) => res.status(404).send(CONFIG.http_404));
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
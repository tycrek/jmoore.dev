// NPM Module imports
const router = require('express').Router();
const path = require('path');
const sass = require('node-sass');
const pug = require('pug');

router.get('/css', (_req, res) => renderSass(res));
router.get('/', (_req, res) => render(res, 'index'));
router.get('/bus', (_req, res) => render(res, 'bus'));

// 404 response
router.use((_req, res, _next) => {
	res.status(404).type('text');
	res.send('404 - This is not the page you are looking for');
});

// 500 response
router.use((err, _req, res, _next) => {
	console.error(err.stack);
	res.status(500).type('text');
	res.send('500 - The server is on fire');
});

module.exports = router;

function render(res, page) {
	return res.render('main', {
		title: 'Test',
		body: pug.compileFile(`client/views/pages/${page}.pug`)()
	});
}

function renderSass(res) {
	sass.render({
		file: path.join(__dirname, '../client/sass/main.scss'),
		outputStyle: "compressed"
	}, (err, result) => {
		if (err) throw new err;
		else res.type('css').send(result.css.toString());
	});
}

// Old code! Only here for reference; it will be removed in a future update
/*
router.get('*', (req, res) => {
	let path = req.path;
	if (path === '/') path = '/index';

	res.render('main', {
		title: 'Joshua Moore - Developer',
		body: includePage(path)
	});
});*/
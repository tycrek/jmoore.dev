const CONFIG = require('./config');
const sass = require('node-sass');
const fs = require('fs-extra');
const router = require('express').Router();
module.exports = router;

router.get('/', (_req, res) => res.render('index', { title: CONFIG.titles.index }));
router.get('/css', (_req, res, next) => renderSass(res, next));
router.get('*', (req, res, next) => renderPug(res, req.url, next));


// 404 & 500 codes
router.use((_req, res) => res.status(404).send(CONFIG.http_404));
router.use(errorHandler);

function errorHandler(err, _req, res, _next) {
	console.error(err.stack);
	res.status(500).send(CONFIG.http_500);
}

function renderPug(res, page, next) {
	// Redirect to trailing slash if necessary
	if (!page.endsWith('/')) return res.redirect(301, `${page}/`);

	// Strip away leading and tailing slashes for filesystem operations
	page = page.substring(1, page.length - 1);

	// Get the full path of the file
	let path = CONFIG.path(`../client/views/pages/${page}.pug`);

	// Check if the file exists (required because router catches *)
	fs.pathExists(path).then(exists => {
		if (!exists) return next();

		require('./data')(page)
			.then(data => {
				let options = {
					title: CONFIG.titles[page],
					data: data
				};
				res.render(page, options);
			});
	});
}

function renderSass(res, next) {
	let options = { file: CONFIG.path('../client/sass/main.scss'), outputStyle: 'compressed' };
	sass.render(options, (err, result) => err ? next(err) : res.type('css').send(result.css));
}
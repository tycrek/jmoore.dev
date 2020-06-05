const { CONFIG, log } = require('./utils');
const cluster = require('cluster');
const express = require('express');
const app = express();

// Only allow paths ending in trailing slash (/) (except for direct file paths)
app.enable('strict routing');

/*  Compress any eligible traffic;
    security enhancements;
    logging for Express functions;
    modern Favicon serving */
app.use(require('compression')());
app.use(require('helmet')({
	frameguard: false
}));
app.use(require('express-pino-logger')({ logger: log }));
app.use(require('serve-favicon')(CONFIG.icon));

// Add Link header for HTTP/2 Push events
app.use((_req, res, next) => {
	let pushHeader = '';
	CONFIG.h2PushPaths.forEach((path) => pushHeader += (`<${path}>; rel=preload, `));

	// Remove the trailing comma and attach the header to the response
	res.header('Link', pushHeader.substring(0, pushHeader.length - 1));
	next();
});

// Static Express routes (for JavaScript, images, robots.txt, manifests, etc.)
app.use(express.static(CONFIG.static));
app.use('/fonts', express.static(CONFIG.fonts));
app.use('/images', express.static(CONFIG.images));

// Route handler
app.use(require('./router'));

// Pug.js renderer
app.set('views', CONFIG.views);
app.set('view engine', 'pug');

// Call proper task for multithreading
cluster.isMaster ? masterThread() : workerThread();

// Thread for master (only runs at launch, possibly after a crash or server reboot)
function masterThread() {
	// One thread per CPU
	let cpus = require('os').cpus().length;
	log.info(`Forking ${cpus} worker threads`);

	// Create new threads for each CPU core
	for (let cpu = 0; cpu < cpus; cpu++) cluster.fork();

	cluster.on('online', (worker) => log.info(`Worker online [${worker.id}]`));
	cluster.on('exit', (worker, code, signal) => {
		log.warn(`Worker exited, reason: ${signal || code} [${worker.id}]`);
		cluster.fork();
	});
}

// Thread for worker (spawned by master thread at launch or after another thread crashed)
function workerThread() {
	app.listen(CONFIG.port, () => log.info(`Server hosted (0.0.0.0:${CONFIG.port}) [${cluster.worker.id}]`));
}

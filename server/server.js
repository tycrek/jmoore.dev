const { CONFIG, log } = require('./utils');
const cluster = require('cluster');
const express = require('express');
const app = express();

app.enable('strict routing');

app.use(require('compression')());
app.use(require('helmet')());
app.use(require('express-pino-logger')({ logger: log }));
app.use(require('serve-favicon')(CONFIG.icon));
app.use(require('express-fileupload')(CONFIG.upload));

app.use(express.static(CONFIG.static));
app.use('/images', express.static(CONFIG.images));
app.use('/files', [filesMiddle, express.static(CONFIG.upload.path)]);
app.use('/upload', require('express-basic-auth')(CONFIG.upload.auth));
app.use(require('./router'));

app.set('views', CONFIG.views);
app.set('view engine', 'pug');

cluster.isMaster ? masterThread() : workerThread();

function masterThread() {
	let cpus = require('os').cpus().length;
	log.info(`Forking ${cpus} worker threads`);

	for (let cpu = 0; cpu < cpus; cpu++) cluster.fork();

	cluster.on('online', (worker) => {
		log.info(`Worker online [${worker.id}]`);
	});

	cluster.on('exit', (worker, code, signal) => {
		log.warn(`Worker exited, reason: ${signal || code} [${worker.id}]`);
		cluster.fork();
	});
}

function workerThread() {
	app.listen(CONFIG.port, () => {
		log.info(`Server hosted (0.0.0.0:${CONFIG.port}) [${cluster.worker.id}]`);
	});
}

function filesMiddle(req, res, next) {
	let u = req.url;
	if (u.endsWith('/') && u !== '/') res.redirect(`/files${u.substring(0, u.length - 1)}`);
	else next();
}
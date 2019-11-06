const { port, path, static, images } = require('./config');
const log = require('./log');
const cluster = require('cluster');
const express = require('express');
const app = express();

app.enable('strict routing');

app.use(require('compression')());
app.use(require('helmet')());
app.use(require('express-pino-logger')({ logger: log }));
app.use(require('serve-favicon')(path('../client/static/favicon.ico')));

app.use(express.static(static));
app.use('/images', express.static(images));
app.use(require('./router'));

app.set('views', path('../client/views/pages'));
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
	app.listen(port, () => {
		log.info(`Server hosted (0.0.0.0:${port}) [${cluster.worker.id}]`);
	});
}
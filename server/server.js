const CONFIG = require('./config');

const express = require('express');
const app = express();

app.use(require('compression')());
app.use(require('helmet')());
app.use(require('serve-favicon')(CONFIG.path('../client/static/favicon.ico')));
app.use(express.static(CONFIG.path('../client/static')));
app.use(require('./router'));

app.set('views', CONFIG.path('../client/views'));
app.set('view engine', 'pug');

app.listen(CONFIG.port, () => console.log(`Server hosted on port: ${CONFIG.port}`));
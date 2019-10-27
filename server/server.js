const CONFIG = require('./config');

const express = require('express');
const app = express();

app.use(require('compression')());
app.use(require('helmet')());
app.use(require('./router'));
app.use(express.static('client/static'));

app.set('views', 'client/views');
app.set('view engine', 'pug');

app.listen(CONFIG.port, () => console.log(`Server hosted on port: ${CONFIG.port}`));
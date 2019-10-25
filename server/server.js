const PORT = 8235;

// NPM Module imports
const express = require('express');
const compress = require('compression');
const helmet = require('helmet');

// Express app setup
const app = express();
app.use(compress());
app.use(helmet());
app.use(express.static('client/static'));
app.use(require('./router'));
app.set('views', './server/views');
app.set('view engine', 'pug');

// Run Express app
app.listen(PORT, () => console.log(`Server hosted on port: ${PORT}`));
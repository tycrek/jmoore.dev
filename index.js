const PORT = 8235;

// NPM Module imports
var express = require('express');
var compress = require('compression');
var helmet = require('helmet');

// Express app setup
var app = express();
app.use(compress());
app.use(helmet());
app.use(require('./router'));

// Run Express app
app.listen(PORT, () => console.log(`Server hosted on port: ${PORT}`));
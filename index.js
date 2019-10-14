const PORT = 8235;

var express = require('express');
var compress = require('compression');

var app = express();
app.use(compress());

// routes
app.get('/', (_req, res) => {
	//
});

// start
app.listen(PORT, () => console.log(`Server hosted on port: ${PORT}`));
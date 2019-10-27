module.exports = {
	path: file => require('path').join(__dirname, file),
	port: 8235,
	http_404: '404 - Page not found',
	http_500: '500 - Internal server error',
};
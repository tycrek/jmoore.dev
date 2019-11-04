module.exports = {
	path: file => require('path').join(__dirname, file),
	port: 8235,
	http_404: '<title>404 - Page not found</title>404 - Page not found',
	http_500: '<title>500 - Internal server error</title>500 - Internal server error',
	routes: ['/bus*', '/green', '/about'],
	titles: {
		index: 'Joshua Moore - Developer',
		bus: 'Route 401 - MacEwan',
		about: 'Joshua Moore - About Me',
		green: 'Environment (Coming soon!)'
	}
};
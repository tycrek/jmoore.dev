module.exports = {
	path: file => require('path').join(__dirname, file),
	port: 8235,
	http_404: '<title>404 - Page not found</title>404 - Page not found',
	http_500: '<title>500 - Internal server error</title>500 - Internal server error',
	titles: {
		index: 'Joshua Moore - Developer',
		bus: 'Bus Schedules',
		'bus/401': 'Route 401 (Ordze - MacEwan)',
		about: 'Joshua Moore - About Me',
		green: 'Environment (Coming soon!)'
	}
};
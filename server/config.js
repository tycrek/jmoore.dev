module.exports = {
	path: file => require('path').join(__dirname, file),
	port: 8235,
	http_404: '<title>404 - Page not found</title><center><h1>404 - Page not found</h1></center>',
	http_500: '<title>500 - Internal server error</title><center><h1>500 - Internal server error</h1></center>',
	titles: {
		index: 'Joshua Moore - Developer',
		bus: 'Bus Schedules',
		'bus/401': 'Route 401 (Ordze - MacEwan)',
		about: 'Joshua Moore - About Me',
		green: 'Environment (Coming soon!)'
	}
};
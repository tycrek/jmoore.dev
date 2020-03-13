const { log, path } = require('./utils');
const fs = require('fs-extra');
const IPinfo = require('node-ipinfo');

var ipinfo;
var IP_CACHE;

module.exports = {
	track: (req, res, next) => {
		// Initialize IPinfo API (https://ipinfo.io/)
		if (!ipinfo) readIpinfoToken();

		// Parse the IP address
		let ip = req.ip.replace('::ffff:', '');

		// Check if IP is already in the cache
		if (IP_CACHE.hasOwnProperty(ip)) {
			log.debug(`Cached country: ${IP_CACHE[ip]}`);
			next();
		} else {
			// Use API to lookup country
			ipinfo.lookupIp(ip)
				.then((response) => {
					let country = response.country;

					log.debug(`New country: ${country}`);

					IP_CACHE[ip] = country;

					fs.writeJson(
						path('../data/ip_cache.json'),
						IP_CACHE,
						{ spaces: '\t', EOL: '\n' }
					)
						.then(() => next())
						.catch((err) => {
							log.warn(err);
							next();
						});
				});
		}
	}
};

//TODO: Log each IP address visits (numerical)
//TODO: log browsers (through user-agent)
//TODO: Log page hits
//TODO: Referring site if possible (like Google, external links, yada yada)
//TODO: Device (screen size most likely, or user-agent)
//TODO: Daily/weekly/monthly/yearly stats?
//TODO: Somewhat decent dashboard

function readIpinfoToken() {
	let token = fs.readJsonSync(path('auth.json')).ipinfo;
	ipinfo = new IPinfo(token);

	IP_CACHE = fs.readJsonSync(path('../data/ip_cache.json'));
}
const { log, path } = require('./utils');
const fs = require('fs-extra');
const IPinfo = require('node-ipinfo');
const moment = require('moment');
const UA = require('useragent'); UA(true);

var ipinfo;
var IP_CACHE;
var VISITORS;

module.exports = {
	init: () => {
		return new Promise((resolve, reject) => {
			// Initialize IPinfo API (https://ipinfo.io/)
			ipinfo = new IPinfo(fs.readJsonSync(path('auth.json')).ipinfo);

			IP_CACHE = fs.readJsonSync(path('../data/analytics/ip_cache.json'));

			// Read existing analytics files
			if (!VISITORS) VISITORS = fs.readJsonSync(path('../data/analytics/visitors.json'));

			resolve();
		});
	},
	track: (req, res, next) => {

		// Parse the IP address
		let ip = req.ip.replace('::ffff:', '');
		let ua = UA.lookup(req.headers['user-agent']);

		let period = `${moment().year()}-${(moment().month() + 1).toString().padStart(2, '0')}`;

		if (!VISITORS.countries[period]) VISITORS.countries[period] = {};
		if (!VISITORS.browsers[period]) VISITORS.browsers[period] = {};
		if (!VISITORS.os[period]) VISITORS.os[period] = {};
		if (!VISITORS.device[period]) VISITORS.device[period] = {};


		countryFromIp(ip).then((country) => {
			if (!VISITORS.countries[period][country]) VISITORS.countries[period][country] = 0;
			if (!VISITORS.browsers[period][country]) VISITORS.browsers[period][ua.family] = 0;
			if (!VISITORS.os[period][country]) VISITORS.os[period][ua.os.family] = 0;
			if (!VISITORS.device[period][country]) VISITORS.device[period][ua.device.family] = 0;

			VISITORS.countries[period][country] += 1;
			VISITORS.browsers[period][ua.family] += 1;
			VISITORS.os[period][ua.os.family] += 1;
			VISITORS.device[period][ua.device.family] += 1;

			//flushAnalytics();
			next();
		});
	},
	flushAnalytics: () => {
		fs.writeJson(path('../data/analytics/ip_cache.json'), IP_CACHE, { spaces: '\t', EOL: '\n' });
		fs.writeJson(path('../data/analytics/visitors.json'), VISITORS, { spaces: '\t', EOL: '\n' });
	}
}

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

	IP_CACHE = fs.readJsonSync(path('../data/analytics/ip_cache.json'));
}

function countryFromIp(ip) {
	return new Promise((resolve, reject) => {
		// Check if IP is already in the cache
		if (IP_CACHE.hasOwnProperty(ip)) resolve(IP_CACHE[ip]);
		else {
			// Use API to lookup country
			ipinfo.lookupIp(ip).then((response) => {
				let c = response.country;
				IP_CACHE[ip] = c;
				resolve(c);
			});
		}
	});
}
/**
 * This file contains the common middleware used by your routes.
 *
 * Extend or replace these functions as your application requires.
 *
 * This structure is not enforced, and just a starting point. If
 * you have more middleware you may want to group it as separate
 * modules in your project's /lib directory.
 */
var _ = require('lodash');


/**
	Initialises the standard view locals

	The included layout depends on the navLinks array to generate
	the navigation in the header, you may wish to change this array
	or replace it with your own templates / logic.
*/
exports.initLocals = function (req, res, next) {
	res.locals.navLinks = [
		{ label: 'Home', key: 'home', href: '/' },
	];
	res.locals.user = req.user;
	next();
};


/**
	Fetches and clears the flashMessages before a view is rendered
*/
exports.flashMessages = function (req, res, next) {
	var flashMessages = {
		info: req.flash('info'),
		success: req.flash('success'),
		warning: req.flash('warning'),
		error: req.flash('error'),
	};
	res.locals.messages = _.some(flashMessages, function (msgs) { return msgs.length; }) ? flashMessages : false;
	next();
};


/**
	Prevents people from accessing protected pages when they're not signed in
 */
exports.requireUser = function (req, res, next) {
	if (!req.user) {
		req.flash('error', 'Please sign in to access this page.');
		res.redirect('/keystone/signin');
	} else {
		next();
	}
};

exports.cors = function (keystone) {
	return function cors (req, res, next) {

		var origin = keystone.get('cors allow origin');
		if (origin) {
			res.header('Access-Control-Allow-Origin', origin === true ? '*' : origin);
		}

		if (keystone.get('cors allow methods') !== false) {
			res.header('Access-Control-Allow-Methods', keystone.get('cors allow methods') || 'GET,PUT,POST,DELETE,OPTIONS');
		}
		if (keystone.get('cors allow headers') !== false) {
			res.header('Access-Control-Allow-Headers', keystone.get('cors allow headers') || 'Content-Type, Authorization');
		}

		next();
	};
};


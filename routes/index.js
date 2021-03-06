/**
 * This file is where you define your application routes and controllers.
 *
 * Start by including the middleware you want to run for every request;
 * you can attach middleware to the pre('routes') and pre('render') events.
 *
 * For simplicity, the default setup for route controllers is for each to be
 * in its own file, and we import all the files in the /routes/views directory.
 *
 * Each of these files is a route controller, and is responsible for all the
 * processing that needs to happen for the route (e.g. loading data, handling
 * form submissions, rendering the view template, etc).
 *
 * Bind each route pattern your application should respond to in the function
 * that is exported from this module, following the examples below.
 *
 * See the Express application routing documentation for more information:
 * http://expressjs.com/api.html#app.VERB
 */

var keystone = require('keystone');
var middleware = require('./middleware');
var importRoutes = keystone.importer(__dirname);
var bodyParser = require('body-parser');
var path = require('path');
var jsonParser = bodyParser.json({ limit: '50mb' });

// Common Middleware
keystone.pre('routes', middleware.initLocals);
keystone.pre('render', middleware.flashMessages);

// Import Route Controllers
var routes = {
	// views: importRoutes('./views'),
	api: importRoutes('./api')
};

// Setup Route Bindings
exports = module.exports = function (app) {

	// NOTE: To protect a route so that only admins can see it, use the requireUser middleware:
	// app.get('/protected', middleware.requireUser, routes.views.protected);

	app.get('/api/:language/model/:model', keystone.middleware.api, routes.api.abstract.list);
	app.get('/api/:language/model/:model/:slug', keystone.middleware.api, routes.api.abstract.getBySlug);
	app.get('/api/:language/model/:model/id/:id', keystone.middleware.api, routes.api.abstract.getById);
	
	// search
	app.get('/api/:language/search', keystone.middleware.api, routes.api.abstract.getByQuery); //TODO add the getByQuery methods of the rest of the Models


	// Client Routes
	let staticPath = path.join(__dirname, "..", "client", "dist")
	app.use(keystone.express.static(staticPath));

	app.get('*',  function( req, res ){
		res.sendFile('index.html', {root: staticPath});
	});
};

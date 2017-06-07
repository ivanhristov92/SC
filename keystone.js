// Simulate config options from your production environment by
// customising the .env file in your project's root folder.
require('dotenv').config();

// Require keystone
var keystone = require('keystone');
var handlebars = require('express-handlebars');

// Initialise Keystone with your project's configuration.
// See http://keystonejs.com/guide/config for available options
// and documentation.

keystone.init({
	'name': 'ShortCut',
	'brand': 'ShortCut',

	'sass': 'public',
	'static': 'public',
	'favicon': 'public/favicon.ico',
	'views': 'templates/views',
	'view engine': '.hbs',

	'custom engine': handlebars.create({
		layoutsDir: 'templates/views/layouts',
		partialsDir: 'templates/views/partials',
		defaultLayout: 'default',
		helpers: new require('./templates/views/helpers')(),
		extname: '.hbs',
	}).engine,

	"wysiwyg cloudinary images": true,
	"wysiwyg images": true,
	'wysiwyg additional buttons': 'searchreplace visualchars,'
	+ ' charmap ltr rtl pagebreak paste, forecolor backcolor,'
	+' emoticons media, preview print',
	"wysiwyg additional plugins": 'example, table, advlist, anchor,'
	+ ' autolink, autosave, bbcode, charmap, contextmenu, '
	+ ' directionality, emoticons, fullpage, hr, media, pagebreak,'
	+ ' paste, preview, print, searchreplace, textcolor,'
	+ ' visualblocks, visualchars, wordcount',
	
	'auto update': true,
	'session': true,
	'auth': true,
	'user model': 'User',
});

keystone.set('cloudinary config', { cloud_name: 'dnhanaafj', api_key: '835575211177616', api_secret: 'Czn1Epw3Y-LL_cBg5AQT2Xh3YNA' });
// or
// keystone.set('cloudinary config', 'cloudinary://api_key:api_secret@cloud_name' );

// optional, will prefix all built-in tags with 'keystone_'
keystone.set('cloudinary prefix', 'sc');

// // optional, will prefix each image public_id with [{prefix}]/{list.path}/{field.path}/
keystone.set('cloudinary folders', true);
//
// // optional, will force cloudinary to serve images over https
// keystone.set('cloudinary secure', true);

// Load your project's Models
keystone.import('models');

// Setup common locals for your templates. The following are required for the
// bundled templates and layouts. Any runtime locals (that should be set uniquely
// for each request) should be added to ./routes/middleware.js
keystone.set('locals', {
	_: require('lodash'),
	env: keystone.get('env'),
	utils: keystone.utils,
	editable: keystone.content.editable,
});

// Load your project's Routes
keystone.set('routes', require('./routes'));


// Configure the navigation bar in Keystone's Admin UI
keystone.set('nav', {
	users: 'users',
});

// Start Keystone to connect to your database and initialise the web server



keystone.start();

module.exports = keystone;

var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * News Model
 * ==========
 */

var News = new keystone.List('News', {
	map: { name: 'title' },
	autokey: { path: 'slug', from: 'title', unique: true },
	defaultSort: '-createdAt'
});

News.add({
	title: { type: String, required: true },
	content: {
		brief: { type: Types.Html, wysiwyg: true, height: 150 },
		extended: { type: Types.Html, wysiwyg: true, height: 400 }
	},
	featuredImage: Types.CloudinaryImage,
	createdAt: { type: Date, default: Date.now }
});

News.defaultColumns = 'title, state|20%, author|20%, publishedDate|20%';
News.register();

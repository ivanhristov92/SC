var keystone = require('keystone');
var Types = keystone.Field.Types;

// for language selection
exports._fields = [
	"_id",
	"slug",
	"title",
	"content",
	"featuredImage",
	"createdAt"
];
/**
 * News Model
 * ==========
 */

var News = new keystone.List('News', {
	map: { name: 'title.en' },
	autokey: { path: 'slug', from: 'title.en', unique: true },
	defaultSort: '-createdAt'
});

News.add({
	lang: { type: Types.Select, label: '', options: 'en, bg', default: 'en' },
	title: {
		en: { type: String, required: true, label: 'Title', dependsOn: { lang: 'en' } },
		bg: { type: String, required: false, label: 'Заглавие', dependsOn: { lang: 'bg' }, default: "" }
	},
	content: {
		en: { type: Types.Html, wysiwyg: true, height: 400, label: 'content extended', dependsOn: {lang: 'en'}},
		bg: {type: Types.Html, wysiwyg: true, height: 400, label: 'Съдържание', dependsOn: {lang: 'bg'}}
	},

	featuredImage: { type: Types.CloudinaryImage, select: true, selectPrefix: 'sc' },
	createdAt: { type: Date, default: Date.now }
});

News.defaultColumns = 'title, state|20%, author|20%, publishedDate|20%';
News.register();

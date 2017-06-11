var keystone = require('keystone');
var Types = keystone.Field.Types;

exports._newsFields = [
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
	language: { type: Types.Select, label: '', options: 'en, bg', default: 'en' },
	title: {
		en: { type: String, required: true, label: 'Title', dependsOn: { language: 'en' } },
		bg: { type: String, required: false, label: 'Заглавие', dependsOn: { language: 'bg' } }
	},
	content: {
		en: {
			brief: {type: Types.Html, wysiwyg: true, height: 150, label: 'content brief', dependsOn: {language: 'en'}},
			extended: { type: Types.Html, wysiwyg: true, height: 400, label: 'content extended', dependsOn: {language: 'en'}}
		}, 
		bg: {
			brief: {type: Types.Html, wysiwyg: true, height: 150, label: 'Описание', dependsOn: {language: 'bg'}},
			extended: {type: Types.Html, wysiwyg: true, height: 400, label: 'Съдържание', dependsOn: {language: 'bg'}}
		}
	},

	featuredImage: { type: Types.CloudinaryImage, select: true, selectPrefix: 'sc' },
	createdAt: { type: Date, default: Date.now }
});

News.defaultColumns = 'title, state|20%, author|20%, publishedDate|20%';
News.register();

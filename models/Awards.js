var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * News Model
 * ==========
 */

var Awards = new keystone.List('Awards', {
	map: { name: 'title' },
	autokey: { path: 'slug', from: 'title', unique: true },
	defaultSort: '-createdAt'
});

exports._instanceFields = [
	"_id",
	"slug",
	"title",
	"content",
	"featuredImage",
	"createdAt"
];

Awards.add({
	lang: { type: Types.Select, label: '', options: 'en, bg', default: 'en' },
	title: {
		en: { type: String, required: true, label: 'Title', dependsOn: { lang: 'en' }, default: "Default Title" },
		bg: { type: String, required: false, label: 'Заглавие', dependsOn: { lang: 'bg' }, default: "" }
	},
	content: {
		en: { type: Types.Html, wysiwyg: true, height: 400, label: 'content extended', dependsOn: {lang: 'en'}},
		bg: {type: Types.Html, wysiwyg: true, height: 400, label: 'Съдържание', dependsOn: {lang: 'bg'}}
	},

	featuredImage: { type: Types.CloudinaryImage, select: true, selectPrefix: 'sc' },
	createdAt: { type: Date, default: Date.now }
});

Awards.defaultColumns = 'title, state|20%, author|20%, publishedDate|20%';
Awards.register();

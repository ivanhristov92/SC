var keystone = require('keystone');
var Types = keystone.Field.Types;
/**
 * News Model
 * ==========
 */

const ListKey = "Prizes";
exports.ListKey = ListKey;

var List = new keystone.List(ListKey, {
	map: { name: 'title.en' },
	autokey: { path: 'slug', from: 'title.en', unique: true },
	defaultSort: '-createdAt'
});

List.add({
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

List.defaultColumns = 'title.en, createdAt|20%';
List.register();

// for language selection
exports._instanceFields = Object.freeze([
	"_id",
	"slug",
	"title",
	"content",
	"featuredImage",
	"createdAt"
]);

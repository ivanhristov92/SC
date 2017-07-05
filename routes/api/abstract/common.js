/**
 * Created by Game Station on 30.6.2017 г..
 */
const _ 		= require("ramda");
const keystone  = require('keystone');
const utils 	= require("../utils");

const Models = Object.defineProperties({}, {
	News: {
		value: keystone.list("News"),
		enumerable: true
	},
	Awards: {
		value: keystone.list("Awards"),
		enumerable: true
	},
	toArray: {
		value: () => _.values(Models),
		enumerable: false
	}
});

const ModelFields = Object.freeze({
	[Models.News.key]  : require("../../../models/News")._instanceFields,
	[Models.Awards.key]: require("../../../models/Awards")._instanceFields,
	getByKey: ModelKey => ModelFields[ModelKey] || []
});

const _ModelInUrl = Object.freeze({
	News: "news",
	Awards: "awards"
});

exports.allModels = Models.toArray();
exports.allModelFields = ModelFields;

const extractModelFields = ModelKey => ModelFields.getByKey(ModelKey);

const extractModelKey = req => {
	switch(req.params.model){
		case _ModelInUrl.News:
			return Models.News.key;
		case _ModelInUrl.Awards:
			return Models.Awards.key;
		default:
			""
	}
};

exports.extractModelKey = extractModelKey;

const getLanguageVersion = lang => ModelKey => items => {
	
	let fields = extractModelFields(ModelKey);
	
	return (items || []).map(piece =>
		fields.reduce((accumulator, key) => {
			let value = piece[key];
			return Object.assign({}, accumulator, {
				[key]: (_.equals(typeof value, "object") && _.has(lang, value)) ? value[lang] : value
			})
		}, {})
	);
};


/**
 *
 * getEnglishVersion::   Array<PieceOfNews> -> Array<PieceOfNews>
 * getBulgarianVersion:: Array<PieceOfNews> -> Array<PieceOfNews>
 */
const getEnglishVersion   = getLanguageVersion("en");
const getBulgarianVersion = getLanguageVersion("bg");

/**
 * getPreferredLanguageVersion:: Req -> Array<PieceOfNews> -> Array<PieceOfNews>
 *
 * @param req - Express 'reqiest' object
 * @param news - Array<PieceOfNews>
 */

const getPreferredLanguageVersion = req => ModelKey => news =>
	utils.language.isBulgarian(req) ?
		getBulgarianVersion(ModelKey)(news):
		getEnglishVersion(ModelKey)(news);

exports.getPreferredLanguageVersion = getPreferredLanguageVersion;


const getPreferredLanguageVersionForModel = req => {
	let key = extractModelKey(req);
	return getPreferredLanguageVersion(req)(key)
};

exports.getPreferredLanguageVersionForModel = getPreferredLanguageVersionForModel;

/**
 *
 * @param res: Express Response Object
 * @param items: Array<Item>
 */

// sendAPIResponse :: ExpressRes -> Array<Items> -> ExpressRes
const sendAPIResponse =  res => items =>
	res.apiResponse({
		items
	});

exports.sendAPIResponse = sendAPIResponse;

const extractModelType = req => {
	switch(req.params.model){
		case "news":
			return Models.News.model;
		case "awards":
			return Models.Awards.model;
		default:
			throw new Error("Unknown Model Type");
	}
};

exports.extractModelType = extractModelType;

exports.test = {
	getLanguageVersion,
	getEnglishVersion,
	getBulgarianVersion,
	getPreferredLanguageVersion,
	sendAPIResponse,
	extractModelType
}

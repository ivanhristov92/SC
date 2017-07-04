/**
 * Created by Game Station on 30.6.2017 г..
 */
const _ = require("ramda");
const keystone    = require('keystone');

const utils 	  = require("../utils");
const _newsFields   = require("../../../models/News")._fields;
const _awardsFields = require("../../../models/Awards")._fields;
const News 	      = keystone.list('News');
const Awards      = keystone.list('Awards');


const allModels = [News, Awards];
exports.allModels = allModels;


const getLanguageVersion = lang => items => {
	
	
	return (items || []).map(piece =>
		_newsFields.reduce((accumulator, key) => {
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

const getPreferredLanguageVersion = (req) => news =>
	utils.language.isBulgarian(req) ?
		getBulgarianVersion(news):
		getEnglishVersion(news);

exports.getPreferredLanguageVersion = getPreferredLanguageVersion;

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
			return News.model;
		case "awards":
			return Awards.model;
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

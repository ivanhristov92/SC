/**
 * Created by Game Station on 30.6.2017 г..
 */
const _ = require("ramda");
const keystone    = require('keystone');

const utils 	  = require("../utils");
const _newsFields = require("../../../models/News")._newsFields;
const News 	      = keystone.list('News');
const Awards      = keystone.list('Awards');







const getLanguageVersion = lang => news => {
	return (news || []).map(piece =>
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
exports.getPreferredLanguageVersion = (req)=>news=>
	utils.language.isBulgarian(req) ?
		getBulgarianVersion(news):
		getEnglishVersion(news);


/**
 *
 * @param as: String
 */
exports.sendAPIResponse =  res => items =>{
	res.apiResponse({
		items
	})
};

exports.extractModelType = req => {
	switch(req.params.model){
		case "news":
			return News.model;
		case "awards":
			return Awards.model;
		default:
			throw new Error("Unknown Model Type");
	}
};

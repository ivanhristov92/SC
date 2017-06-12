// @flow
'use strict';

const _ 		  = require("ramda");
const async 	  = require('async');
const keystone    = require('keystone');
const News 	      = keystone.list('News');
const Maybe 	  = require("ramda-fantasy").Maybe;
const Future 	  = require("ramda-fantasy").Future;

const _newsFields = require("../../../models/News")._newsFields;

/**
 * type PieceOfNews = {
		_id: string | object,
		slug: string,
		title: {
			en: string,
			bg: string
		},
		content: {
		
			en:	{
				brief?: ?HTML,	
				extended?: HTML	
			},
			bg: {
				brief?: ?HTML,	
				extended?: HTML
			}
			
		},
		
		featuredImage? CloudinaryImage,
		createdAt: Date
	}
 */

/**
 * List News
 */


/**
 * getAllNews:: _ -> Array<PieceOfNews>
 */
const getAllNews = ()=>
	new Promise((resolve, reject)=>{
		/**
		 * @param news: Array<PieceOfNews>
		 */
		News.model.find().exec( function( err, news ) {
			if (err) return reject(err);
			resolve(news);
		});
	});

/**
 * getLastNNews: Int -> Function -> Array<PieceOfNews>
 */
const getLastNNews = N => ()=>
	new Promise((resolve, reject)=>{
		/**
		 * @param news: Array<PieceOfNews>
		 */
		News.model.find()
			.sort('-createdAt')
			.limit(N)
			.exec( function( err, news ) {
				if (err) return reject(err);
				resolve(news);
			});
	});

/**
 * getTheDesiredAmountOfNews:: Req -> Function -> Function -> Array<PieceOfNews>
 *
 * @param req - Express 'req' object
 */
const getTheDesiredAmountOfNews = req => () =>
	req.query.last ?
	getLastNNews(req.query.last)() :
	getAllNews();

/**
 * getLanguageVersion:: String -> Array<PieceOfNews> -> Array<PieceOfNews>
 * 
 * @param news: Array<PieceOfNews>
 * @param lang: "en" | "bg"
 */

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
const getPreferredLanguageVersion = (req)=>news=>
	_.equals(req.params.language, "en") ?
		getEnglishVersion(news)	:
		getBulgarianVersion(news);



const sendAPIResponse =  res=>news=>{
	res.apiResponse({
		news
	})
};


exports.test = {
	getAllNews,
	getLastNNews,
	getTheDesiredAmountOfNews,
	getEnglishVersion,
	getBulgarianVersion,
	getPreferredLanguageVersion,
	sendAPIResponse
};

exports.getPreferredLanguageVersion = getPreferredLanguageVersion;
exports.sendAPIResponse = sendAPIResponse;

exports.list = ( req, res ) =>
	_.composeP(
		sendAPIResponse(res),
		getPreferredLanguageVersion(req),
		getTheDesiredAmountOfNews(req)
	)();

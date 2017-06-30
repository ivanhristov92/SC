// @flow
'use strict';

const _ 		  = require("ramda");
const async 	  = require('async');
const keystone    = require('keystone');
const Maybe 	  = require("ramda-fantasy").Maybe;
const Future 	  = require("ramda-fantasy").Future;
const utils 	  = require("../utils");
const _newsFields = require("../../../models/News")._newsFields;

const News 	      = keystone.list('News');
const Awards      = keystone.list('Awards');

const getPreferredLanguageVersion  = require("./common").getPreferredLanguageVersion;
const sendAPIResponse 			   = require("./common").sendAPIResponse;
const extractModelType 			   = require("./common").extractModelType;

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
const getAllNews = req => ()=> {

	let AbstractModel = extractModelType(req);

	return new Promise((resolve, reject) => {
		/**
		 * @param news: Array<PieceOfNews>
		 */
		AbstractModel.find().exec(function (err, news) {
			if (err) return reject(err);
			resolve(news);
		});
	});
}

/**
 * getLastNNews: Int -> Function -> Array<PieceOfNews>
 */
const getLastNNews = req => N => ()=> {
	let AbstractModel = extractModelType(req);

	return new Promise((resolve, reject) => {
		/**
		 * @param news: Array<PieceOfNews>
		 */
		AbstractModel.find()
			.sort('-createdAt')
			.limit(N)
			.exec(function (err, news) {
				if (err) return reject(err);
				resolve(news);
			});
	});
}
/**
 * getTheDesiredAmountOfNews:: Req -> Function -> Function -> Array<PieceOfNews>
 *
 * @param req - Express 'req' object
 */
const getTheDesiredAmountOfNews = req => () =>
	req.query.last ?
	getLastNNews(req)(req.query.last)() :
	getAllNews(req)();

exports.test = {
	getAllNews,
	getLastNNews,
	getTheDesiredAmountOfNews,
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

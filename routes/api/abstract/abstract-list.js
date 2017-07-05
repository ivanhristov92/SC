// @flow
'use strict';
const _ = require("ramda");
const getPreferredLanguageVersionForModel  = require("./common").getPreferredLanguageVersionForModel;
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
 * getAll:: _ -> Array<PieceOfNews>
 */
const getAll = req => ()=> {

	let AbstractModel = extractModelType(req);

	return new Promise((resolve, reject) => {
		/**
		 * @param items: Array<Item>
		 */
		AbstractModel.find().exec(function (err, items) {
			if (err) return reject(err);
			resolve(items);
		});
	});
};

/**
 * getLastNItems: ExpressReq -> Int -> _ -> Array<Item>
 */
const getLastNItems = req => N => ()=> {
	
	let AbstractModel = extractModelType(req);

	return new Promise((resolve, reject) => {
		/**
		 * @param news: Array<PieceOfNews>
		 */
		AbstractModel.find()
			.sort('-createdAt')
			.limit(N)
			.exec(function (err, items) {
				if (err) return reject(err);
				resolve(items);
			});
	});
};
/**
 * getTheDesiredAmountOfItems :: Req -> _ -> _ -> Array<PieceOfNews>
 *
 * @param req - Express 'req' object
 */
const getTheDesiredAmountOfItems = req => () =>
	req.query.last ?
	getLastNItems(req)(req.query.last)() :
	getAll(req)();

exports.test = {
	getAll,
	getLastNItems,
	getTheDesiredAmountOfItems,
};


exports.list = ( req, res ) =>
	_.composeP(
		sendAPIResponse(res),
		getPreferredLanguageVersionForModel(req),
		getTheDesiredAmountOfItems(req)
	)();

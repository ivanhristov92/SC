// @flow
'use strict';
const _ = require("ramda");
const getPreferredLanguageVersionForModel  = require("./common").getPreferredLanguageVersionForModel;
const sendAPIResponse 			   = require("./common").sendAPIResponse;
const sendAPIError  			   = require("./common").sendAPIError;
const extractModelType 			   = require("./common").extractModelType;
const Future 					   = require("ramda-fantasy").Future;
const Either 					   = require("ramda-fantasy").Either;
const Maybe 					   = require("ramda-fantasy").Maybe;

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
const getAll = req => ()=> 
	Future((reject, resolve) => 
		_.pipe(
			_.always(req)
			, extractModelType
			, _.ifElse(
				Maybe.isJust
				, _.map(AbstractModel =>
					AbstractModel.find().exec((err, items) => {
						if (err) reject(err);
						resolve(items);
					})
				)
				, reject
			)
		)()
	);

/**
 * getLastNItems: ExpressReq -> Int -> _ -> Array<Item>
 */
const getLastNItems = req => N => ()=> 
	Future((reject, resolve) =>
		_.pipe(
			_.always(req)
			, extractModelType
			, _.ifElse(
				Maybe.isJust
				, _.map(AbstractModel =>
					AbstractModel.find()
						.sort('-createdAt')
						.limit(N)
						.exec((err, items) => {
							if (err) reject(err);
							resolve(items);
						})
				)
				, reject
			)
		)()
	);

/**
 * getTheDesiredAmountOfItems :: Req -> _ -> _ -> Array<PieceOfNews>
 *
 * @param req - Express 'req' object
 */
const getTheDesiredAmountOfItems = req => () =>
	req.query.last ?
	getLastNItems(req)(req.query.last)() :
	getAll(req)();


const FutureList = req =>
	_.compose(
		_.map(getPreferredLanguageVersionForModel(req))
		, getTheDesiredAmountOfItems(req)
	)();

exports.test = {
	getAll,
	getLastNItems,
	getTheDesiredAmountOfItems,
	FutureList
};

exports.list = ( req, res ) =>
	FutureList(req).fork(
		err => sendAPIError(res)(404), 
		data => sendAPIResponse(res)(data)
	);

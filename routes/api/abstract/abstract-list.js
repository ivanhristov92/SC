// @flow
'use strict';
const _ = require("ramda");
const getPreferredLanguageVersionForModel  = require("./common").getPreferredLanguageVersionForModel;
const sendAPIResponse 			   = require("./common").sendAPIResponse;
const sendAPIError  			   = require("./common").sendAPIError;
const ifModelDoElseReject 		   = require("./common").ifModelDoElseReject;


/**
 * getAll:: _ -> Array<PieceOfNews>
 */
const getAll = req => () => ifModelDoElseReject(req)(
	_.curry((reject, resolve, AbstractModel) =>{
		AbstractModel.find().exec((err, items) => {
			if (err) reject(err);
			resolve(items);
		})
	})
);

/**
 * getLastNItems: ExpressReq -> Int -> _ -> Array<Item>
 */
const getLastNItems = (req, N) => ()=> 
	ifModelDoElseReject(req)(
		_.curry((reject, resolve, AbstractModel) =>
			AbstractModel.find()
			.sort('-createdAt')
			.limit(N)
			.exec((err, items) => err ? reject(err) : resolve(items)))
	);


/**
 * getTheDesiredAmountOfItems :: Req -> _ -> _ -> Array<PieceOfNews>
 *
 * @param req - Express 'req' object
 */
const getTheDesiredAmountOfItems = req => () =>
	req.query.last ?
	getLastNItems(req, req.query.last)() :
	getAll(req)();


const futureList = req =>
	_.compose(
		_.map(getPreferredLanguageVersionForModel(req))
		, getTheDesiredAmountOfItems(req)
	)();

exports.test = {
	getAll,
	getLastNItems,
	getTheDesiredAmountOfItems,
	futureList
};

exports.list = ( req, res ) =>
	futureList(req).fork(
		err => sendAPIError(res)(404), 
		data => sendAPIResponse(res)(data)
	);

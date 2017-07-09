/**
 * Created by Game Station on 10.6.2017 г..
 */
// @flow
'use strict';
const _ = require("ramda");
const getPreferredLanguageVersionForModel = require("./common").getPreferredLanguageVersionForModel;
const sendAPIResponse = require("./common").sendAPIResponse;
const sendAPIError 		 = require("./common").sendAPIError;
const extractModelType = require("./common").extractModelType;
const Future 					   = require("ramda-fantasy").Future;
const Maybe 					   = require("ramda-fantasy").Maybe;


const extractId = req => _.always(req.params.id);


const _getById = _.curry((req, id) => 
	Future((reject, resolve) => 
		_.pipe(
			_.always(req)
			, extractModelType
			, _.ifElse(
				Maybe.isJust
				, _.map(AbstractModel => {
					AbstractModel.findById(id)
					/**
					 *  @param news: PieceOfNews
					 */
						.exec((err, item) => {
							if (err) reject(err);
							resolve(item);
						});
				})
				, reject
			)
		)()
	)
);
	
	
			

const futureList = req => _.compose(
	_.map(getPreferredLanguageVersionForModel(req))
	, _.map(Array)
	, _getById(req)
	, extractId(req)
)();



exports.getById = (req, res) =>
	futureList(req).fork(
		err => sendAPIError(res)(404),
		data => sendAPIResponse(res)(data)
	);

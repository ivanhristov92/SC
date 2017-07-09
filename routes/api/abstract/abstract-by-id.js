/**
 * Created by Game Station on 10.6.2017 г..
 */
// @flow
'use strict';
const _ = require("ramda");
const getPreferredLanguageVersionForModel = require("./common").getPreferredLanguageVersionForModel;
const sendAPIResponse = require("./common").sendAPIResponse;
const extractModelType = require("./common").extractModelType;
const Future 					   = require("ramda-fantasy").Future;


const extractId = req => _.always(req.params.id);


const _getById = _.curry((req, id) => {
	
	let MaybeAbstractModel = extractModelType(req);
	
	return MaybeAbstractModel.chain(AbstractModel => {
	
		return Future((reject, resolve) => {
			AbstractModel.findById(id)
			/**
			 *  @param news: PieceOfNews
			 */
				.exec((err, item) => {
					if (err) reject(err);
					resolve(item);
				});
		});
	})
});


exports.getById = (req, res) =>
	_.compose(
		_.map(sendAPIResponse(res))
		, _.map(getPreferredLanguageVersionForModel(req))
		, _.map(Array)
		, _getById(req)
		, extractId(req)
	)();

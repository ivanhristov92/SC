// @flow
'use strict';
const _ 		  = require("ramda");
const getPreferredLanguageVersionForModel = require("./common").getPreferredLanguageVersionForModel;
const sendAPIResponse  = require("./common").sendAPIResponse;
const sendAPIError 	   = require("./common").sendAPIError;
const extractModelType = require("./common").extractModelType;
const Future 		   = require("ramda-fantasy").Future;
const Maybe 		   = require("ramda-fantasy").Maybe;


const extractSlug = req => _.always( req.params.slug );

const _getBySlug = req => slug => 
	Future((reject, resolve) => 
		_.pipe(
			_.always(req)
			, extractModelType
			, _.ifElse(
				Maybe.isJust
				, _.map(AbstractModel =>
					AbstractModel.find({slug})
						.exec((err, news) => {
							if (err) reject(err);
							resolve(news);
						})
				)
				, reject
			)
		)()
	);
			
const futureList = req => _.compose(
	_.map(getPreferredLanguageVersionForModel(req)),
	_getBySlug(req),
	extractSlug(req)
)();


exports.getBySlug = ( req, res ) =>
	futureList(req).fork(
		err => sendAPIError(res)(404),
		data => sendAPIResponse(res)(data)
	);
	


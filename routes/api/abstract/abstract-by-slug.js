// @flow
'use strict';
const _ 		  = require("ramda");
const getPreferredLanguageVersionForModel = require("./common").getPreferredLanguageVersionForModel;
const sendAPIResponse = require("./common").sendAPIResponse;
const extractModelType = require("./common").extractModelType;


const extractSlug = req =>
	()=> Promise.resolve(req.params.slug);


const _getBySlug = req => slug => {

	let AbstractModel = extractModelType(req);

	return new Promise((resolve, reject) => {
		AbstractModel.find({slug})
		/**
		 *  @param news: Array<PieceOfNews>
		 */
			.exec(function (err, news) {
				if (err) {
					reject(err)
				}
				resolve(news);
			});
	});
}

exports.getBySlug = ( req, res ) => 
	_.composeP(
		sendAPIResponse(res),
		getPreferredLanguageVersionForModel(req),
		_getBySlug(req),
		extractSlug(req)
	)();
	


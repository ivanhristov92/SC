// @flow
'use strict';

const _ 		  = require("ramda");
const async 	  = require('async');
const keystone    = require('keystone');
const News 	      = keystone.list('News');
const Awards      = keystone.list('Awards');

const getPreferredLanguageVersion  = require("./common").getPreferredLanguageVersion;
const sendAPIResponse 			   = require("./common").sendAPIResponse;

const extractModelType = req => {
	switch(req.params.model){
		case "news":
			return News.model;
		case "awards":
			return Awards.model;
		default:
			throw new Error("Unknown Model Type");
	}
};
const extractSlug = req =>
	()=> Promise.resolve(req.params.slug);


const _getBySlug = req => slug => {

	let AbstractModel = extractModelType(req);

	return new Promise((resolve, reject) => {
		AbstractModel.model.find({slug})
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
		getPreferredLanguageVersion(req),
		_getBySlug(req),
		extractSlug(req)
	)();
	


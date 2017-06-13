// @flow
'use strict';

const _ 		  = require("ramda");
const async 	  = require('async');
const keystone    = require('keystone');
const News 	      = keystone.list('News');

const getPreferredLanguageVersion = require("./news-list").getPreferredLanguageVersion;
const sendAPIResponse = require("./news-list").sendAPIResponse;

const extractQuery = req =>
	()=> Promise.resolve(req.query.query);


const _getByQuery = query =>
	new Promise((resolve, reject)=>{
	News.model.find({$text: {$search: query}})
	/**
	 *  @param news: Array<PieceOfNews>
	 */
	.exec( function( err, news ) {
		if (err){reject(err)}
		resolve(news);
	});
});

exports.test = {
	extractQuery,
	_getByQuery
};

exports.getByQuery = ( req, res ) => 
	_.composeP(
		sendAPIResponse(res),
		getPreferredLanguageVersion(req),
		_getByQuery,
		extractQuery(req)
	)();
	


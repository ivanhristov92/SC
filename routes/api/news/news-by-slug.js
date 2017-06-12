// @flow
'use strict';

const _ 		  = require("ramda");
const async 	  = require('async');
const keystone    = require('keystone');
const News 	      = keystone.list('News');

const getPreferredLanguageVersion = require("./news-list").getPreferredLanguageVersion;
const sendAPIResponse = require("./news-list").sendAPIResponse;

const extractSlug = req =>
	()=> Promise.resolve(req.params.slug);


const _getBySlug = slug =>
	new Promise((resolve, reject)=>{
	News.model.find({slug})
	/**
	 *  @param news: Array<PieceOfNews>
	 */
	.exec( function( err, news ) {
		if (err){reject(err)}
		resolve(news);
	});
});

exports.getBySlug = ( req, res ) => 
	_.composeP(
		sendAPIResponse(res),
		getPreferredLanguageVersion(req),
		_getBySlug,
		extractSlug(req)
	)();
	


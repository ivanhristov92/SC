// @flow
'use strict';

const _ 		  = require("ramda");
const Fuse 		  = require("fuse.js");
const async 	  = require('async');
const keystone    = require('keystone');
const News 	      = keystone.list('News');
const utils 	  = require("../utils");

const getPreferredLanguageVersion = require("../abstract/common").getPreferredLanguageVersion;
const sendAPIResponse = require("../abstract/common").sendAPIResponse;

const _getAll = () =>
	new Promise((resolve, reject)=>{
		News.model.find({})
		/**
		 *  @param news: Array<PieceOfNews>
		 */
		.exec( function( err, news ) {
			if (err){reject(err)}
			resolve(news);
		});
	});

const _extractQuery = req => ()=> req.query.text;

const _generateFuzzyOptions = () =>
	({
		shouldSort: true,
		threshold: 0.2,
		keys: [
			"title"
		]
	});


const _doFuzzySearch = _.curry((options, items, query) =>{
	let fuse = new Fuse(items, options);
	return fuse.search(query);
});

const _doSearch = req => items =>
	_.compose(
		_doFuzzySearch(_generateFuzzyOptions(), items),
		_extractQuery(req)
	)();


const getAllAndFilterByLanguage = req => 
	_.composeP(
		getPreferredLanguageVersion(req),
		_getAll
	);
		
exports.test = {
	_getAll,
	_extractQuery,
	_generateFuzzyOptions,
	_doFuzzySearch,
	_doSearch,
	getAllAndFilterByLanguage
};

exports.getByQuery = ( req, res ) =>
	_.composeP(
		sendAPIResponse(res),
		_doSearch(req),
		getAllAndFilterByLanguage(req)
	)();
	


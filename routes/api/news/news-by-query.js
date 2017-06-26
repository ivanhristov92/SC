// @flow
'use strict';

const _ 		  = require("ramda");
const Fuse 		  = require("fuse.js");
const async 	  = require('async');
const keystone    = require('keystone');
const News 	      = keystone.list('News');
const utils 	  = require("../utils");

const getPreferredLanguageVersion = require("./news-list").getPreferredLanguageVersion;
const sendAPIResponse = require("./news-list").sendAPIResponse;


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

const _generateFuzzyOptions = req => 
	utils.language.isBulgarian() ?
	{
		shouldSort: true,
		threshold: 0.2,
		keys: [
			"заглавие"
		]
	} :
	{
		shouldSort: true,
		threshold: 0.2,
		keys: [
			"title"
		]
	};


const _doFuzzySearch = _.curry((options, items, query) =>{
	let fuse = new Fuse(items, options);
	return fuse.search(query);
});

const _doSearch = req => items =>
	_.compose(
		_doFuzzySearch(_generateFuzzyOptions(req), items),
		_extractQuery(req)
	)();


exports.test = {
	_getAll,
	_extractQuery,
	_generateFuzzyOptions,
	_doFuzzySearch,
	_doSearch
};

exports.getByQuery = ( req, res ) => 
	_.composeP(
		sendAPIResponse(res),
		_doSearch(req),
		getPreferredLanguageVersion(req),
		_getAll
	)();
	


// @flow
'use strict';

const _ 		  = require("ramda");
const Fuse 		  = require("fuse.js");
const async 	  = require('async');
const keystone    = require('keystone');
const News 	      = keystone.list('News');
const utils 	  = require("../utils");

const log = a => {console.log("eto tuk: !!!:", a); return a;}

const getPreferredLanguageVersion = require("../abstract/common").getPreferredLanguageVersion;
const sendAPIResponse = require("../abstract/common").sendAPIResponse;
const extractModelType 			   = require("./common").extractModelType;

const _getAll = req => () => {
	
	let AbstractModel = extractModelType(req);
	
	return new Promise((resolve, reject) => {
		AbstractModel.find({})
		/**
		 *  @param news: Array<PieceOfNews>
		 */
			.exec(function (err, items) {
				if (err) {
					reject(err)
				}
				resolve(items);
			});
	});
}

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
		log
		,_getAll
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
	


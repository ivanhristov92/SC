// @flow
'use strict';

const _ 		  = require("ramda");
const Fuse 		  = require("fuse.js");
const AllModels   = require("./common").allModels; 

const getPreferredLanguageVersion  = require("../abstract/common").getPreferredLanguageVersion;
const sendAPIResponse 			   = require("../abstract/common").sendAPIResponse;


const fuzzyOptions = ({
	shouldSort: true,
	threshold: 0.2,
	keys: [
		"title"
	]
});


const getAllOf = (Model) => () =>
	new Promise((resolve, reject) => 
		Model.find({})
		/**
		 *  @param news: Array<PieceOfNews>
		 */
		.exec((err, items)=>{
			if (err) {
				reject(err)
			}
			resolve(items);
		})
	);
	

const _extractQuery = req => ()=> req.query.text;

const _doFuzzySearch = _.curry((options, items, query) =>{
	let fuse = new Fuse(items, options);
	return fuse.search(query);
});

const doSearch = req => items =>
	_.compose(
		_doFuzzySearch(fuzzyOptions, items),
		_extractQuery(req)
	)();

const wrapAndLabel = (label) => (items) => ({[label]: items});
		
const queryModel = req => (Model) => 
	_.composeP(
		  wrapAndLabel(Model.key)
		, doSearch(req)
		, getPreferredLanguageVersion(req)
		, getAllOf(Model.model)
	)();

const queryAllModels = req => () => Promise.all(
	AllModels.map(queryModel(req))
);

const formatResponse = _.reduce((acc, obj)=>_.merge(acc, obj), {});

exports.getByQuery = ( req, res ) =>
	_.composeP(
		sendAPIResponse(res)
		, formatResponse
		, queryAllModels(req)
	)();
	
	


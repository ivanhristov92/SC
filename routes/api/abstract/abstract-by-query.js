// @flow
'use strict';

const _ 		  = require("ramda");
const Fuse 		  = require("fuse.js");
const AllModels   = require("./common.js").allModels; 

const getPreferredLanguageVersion  = require("./common").getPreferredLanguageVersion;
const sendAPIResponse 			   = require("./common").sendAPIResponse;
const sendAPIError 			   = require("./common").sendAPIError;

const Future = require("ramda-fantasy").Future;

const fuzzyOptions = ({
	shouldSort: true,
	threshold: 0.2,
	keys: [
		"title"
	]
});


const getAllOf = Model => () =>
	new Promise((resolve, reject) => 
		Model.find({})
		.exec((err, items)=> err ? reject(err) : resolve(items))
	);
	

const _extractQuery = req => _.always(req.query.text);


const _doFuzzySearch = _.curry((options, items, query) =>
	new Fuse(items, options).search(query));


const doSearch = _.curry((req, items) =>
	_.compose(
		_doFuzzySearch(fuzzyOptions, items)
		, _extractQuery(req)
	)()
);

		
const wrapAndLabel = _.curry((label, items) => ({[label]: items}));
		

const queryModel = _.curry((req, Model) => 
	_.composeP(
		wrapAndLabel(Model.key)
		, doSearch(req)
		, getPreferredLanguageVersion(req)(Model.key)
		, getAllOf(Model.model)
	)()
);
		
		
const queryAllModels = req => () => 
	Future((reject, resolve) => 
		Promise.all(AllModels.map(queryModel(req)))
			.then(resolve)
			.catch(reject)
	);


const formatResponse = _.reduce((acc, obj)=>_.merge(acc, obj), {});

const futureResults = req => _.compose(
	_.map(formatResponse)
	, queryAllModels(req)
)();

exports.getByQuery = ( req, res ) =>
	futureResults(req).fork(
		err => sendAPIError(res)(404),
		data => sendAPIResponse(res)(data)
	);

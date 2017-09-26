/**
 * Created by Game Station on 30.6.2017 г..
 */
const _ 		= require("ramda");
const keystone  = require('keystone');
const utils 	= require("../utils");
const Maybe 	= require("ramda-fantasy").Maybe;
const Future 	= require("ramda-fantasy").Future;

/*
type Model = {
	internalName: string,
	path: string,
	urlEquivalent: string
};
type schema = [Model];
*/

let models = require("../../../models/models-config").models;


const ModelKeys = models.reduce((acc, model) =>{
	return Object.assign({}, acc, {[model.internalName]: require(model.path).ListKey});
}, {});


const __getFields__ = (path)=> {
	let fields = Object.keys(require(path).List.schemaFields[0]);
	return ["_id", "slug", ...fields];
};


const ModelFields = Object.assign(
	{getByKey: ModelKey => ModelFields[ModelKey] || []},
	
	models.reduce((acc, model)=>{
	return Object.assign(
		acc, 
		{[ModelKeys[model.internalName]]: __getFields__(model.path)}
		);
	},{})
);


const _ModelInUrl = Object.freeze(
	models.reduce((acc, model)=>{
		return Object.assign({}, acc, {
			[ModelKeys[model.internalName]]: model.urlEquivalent
		})
	}, {})	
);


const Models = Object.defineProperties({}, 
	_.values(ModelKeys)
	.reduce((acc, key)=>
		Object.assign({}, acc, {
			[key]: {
				value: keystone.list(key),
				enumerable: true
			},
			toArray: {
				value: function(){return _.values(Models)},
				enumerable: false
			}
		}),
	{})
);


const extractModelFields = ModelKey => ModelFields.getByKey(ModelKey);


const extractModelKey = req =>
	_.keys(_ModelInUrl)
	.filter(key=>_.equals(_ModelInUrl[key], req.params.model))
	.map(key=>Models[key].key);


// extractModelType :: req -> Model
const extractModelType = req =>
	_.compose(
		_.ifElse(
			_.isEmpty,
			Maybe.Nothing,
			results => Maybe.Just(_.head(results))
			
		)
		, _.map(key=>Models[key].model)
		, _.filter(key=>_.equals(_ModelInUrl[key], req.params.model))
		, _.always(_.keys(_ModelInUrl))
	)();
	


const getLanguageVersion = _.curry((lang, ModelKey, items) =>
	_.compose(
		_.map(item => 
			extractModelFields(ModelKey)
			.reduce((accumulator, key) => {
				let value = item[key];
				return Object.assign({}, accumulator, {
					[key]: (_.equals(typeof value, "object") && _.has(lang, value)) ? value[lang] : value
				})
			}, {})
		)
		, _.defaultTo([])
		, _.always(items)
	)()
);


/**
 *
 * getEnglishVersion::   Array<PieceOfNews> -> Array<PieceOfNews>
 * getBulgarianVersion:: Array<PieceOfNews> -> Array<PieceOfNews>
 */
const getEnglishVersion   = getLanguageVersion("en");
const getBulgarianVersion = getLanguageVersion("bg");


/**
 * getPreferredLanguageVersion:: Req -> Array<PieceOfNews> -> Array<PieceOfNews>
 *
 * @param req - Express 'reqiest' object
 * @param news - Array<PieceOfNews>
 */

const getPreferredLanguageVersion = _.curry((req, ModelKey, news) =>
	utils.language.isBulgarian(req) ?
		getBulgarianVersion(ModelKey)(news):
		getEnglishVersion(ModelKey)(news)
);

		
const getPreferredLanguageVersionForModel = req => {
	let key = extractModelKey(req);
	return getPreferredLanguageVersion(req)(key)
};


/**
 *
 * @param res: Express Response Object
 * @param items: Array<Item>
 */

// sendAPIResponse :: ExpressRes -> Array<Items> -> ExpressRes
const sendAPIResponse =  res => items =>
	res.apiResponse({
		items
	});

const sendAPIError = res => (code) => 
	res.apiError(code);


/**
 *
 * @param fn :: reject -> resolve -> abstractModel -> Unit
 */
const ifModelDoElseReject = _.curry((req, fn) =>
	Future((reject, resolve) =>
		_.pipe(
			_.always(req)
			, extractModelType
			, _.ifElse(
				Maybe.isJust
				, _.map(fn(reject, resolve))
				, reject
			)
		)()
	)
);

exports.ifModelDoElseReject = ifModelDoElseReject;

exports.allModels = Models.toArray();
exports.allModelFields = ModelFields;

exports.sendAPIResponse = sendAPIResponse;
exports.sendAPIError = sendAPIError;
exports.extractModelType = extractModelType;
exports.getPreferredLanguageVersionForModel = getPreferredLanguageVersionForModel;
exports.getPreferredLanguageVersion = getPreferredLanguageVersion;
exports.extractModelKey = extractModelKey;

exports.test = {
	getLanguageVersion,
	getEnglishVersion,
	getBulgarianVersion,
	getPreferredLanguageVersion,
	sendAPIResponse,
	sendAPIError,
	extractModelType
};

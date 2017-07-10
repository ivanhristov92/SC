/**
 * Created by Game Station on 30.6.2017 г..
 */
const _ 		= require("ramda");
const keystone  = require('keystone');
const utils 	= require("../utils");
const Maybe 	= require("ramda-fantasy").Maybe;
const Future 	= require("ramda-fantasy").Future;

const ModelKeys = Object.freeze({
	NewsKey: require("../../../models/News").ListKey,
	AwardsKey: require("../../../models/Awards").ListKey,
	ProductionsKey: require("../../../models/Productions").ListKey,
	ServicesKey: require("../../../models/Services").ListKey,
	PrizesKey: require("../../../models/Prizes").ListKey,
});


const ModelFields = Object.freeze({
	[ModelKeys.NewsKey]  : require("../../../models/News")._instanceFields,
	[ModelKeys.AwardsKey]: require("../../../models/Awards")._instanceFields,
	[ModelKeys.ProductionsKey]: require("../../../models/Productions")._instanceFields,
	[ModelKeys.ServicesKey]: require("../../../models/Services")._instanceFields,
	[ModelKeys.PrizesKey]: require("../../../models/Prizes")._instanceFields,
	getByKey: ModelKey => ModelFields[ModelKey] || []
});


const _ModelInUrl = Object.freeze({
	[ModelKeys.NewsKey]: "news",
	[ModelKeys.AwardsKey]: "awards",
	[ModelKeys.ProductionsKey]: "productions",
	[ModelKeys.ServicesKey]: "services",
	[ModelKeys.PrizesKey]: "prizes"
});


const Models = Object.defineProperties({}, _.values(ModelKeys)
	.reduce((acc, key)=>
		Object.assign({}, acc, {
			[key]: {
				value: keystone.list(key),
				enumerable: true
			},
			toArray: {
				value: () => _.values(Models),
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


// extractModelType :: req -> Either<Model>
const extractModelType = req =>{

	let results = 
		_.keys(_ModelInUrl)
		.filter(key=>_.equals(_ModelInUrl[key], req.params.model))
		.map(key=>Models[key].model);
	
	if(_.isEmpty(results)){
		return Maybe.Nothing();
	}
	return Maybe.Just(_.head(results));
};


const getLanguageVersion = _.curry((lang, ModelKey, items) => {
	
	let fields = extractModelFields(ModelKey);
	
	return (items || []).map(piece =>
		fields.reduce((accumulator, key) => {
			let value = piece[key];
			return Object.assign({}, accumulator, {
				[key]: (_.equals(typeof value, "object") && _.has(lang, value)) ? value[lang] : value
			})
		}, {})
	);
});


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

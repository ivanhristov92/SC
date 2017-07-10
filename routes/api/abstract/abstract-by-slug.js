// @flow
'use strict';
const _  = require("ramda");
const getPreferredLanguageVersionForModel = require("./common").getPreferredLanguageVersionForModel;
const sendAPIResponse  = require("./common").sendAPIResponse;
const sendAPIError = require("./common").sendAPIError;
const ifModelDoElseReject = require("./common").ifModelDoElseReject;

const extractSlug = req => _.always( req.params.slug );

const _getBySlug = _.curry((req, slug) =>
	ifModelDoElseReject(req)(
		_.curry((reject, resolve, AbstractModel)=>
			AbstractModel.find({slug})
			.exec((err, news) => {
				if (err) reject(err);
				resolve(news);
			})
		)
	)
);
			
const futureList = req => _.compose(
	_.map(getPreferredLanguageVersionForModel(req)),
	_getBySlug(req),
	extractSlug(req)
)();


exports.getBySlug = ( req, res ) =>
	futureList(req).fork(
		err => sendAPIError(res)(404),
		data => sendAPIResponse(res)(data)
	);

/**
 * Created by Game Station on 10.6.2017 г..
 */
// @flow
'use strict';
const _ = require("ramda");
const getPreferredLanguageVersionForModel = require("./common").getPreferredLanguageVersionForModel;
const sendAPIResponse = require("./common").sendAPIResponse;
const sendAPIError  = require("./common").sendAPIError;
const ifModelDoElseReject = require("./common").ifModelDoElseReject;


const extractId = req => _.always(req.params.id);


const _getById = _.curry((req, id) =>
	ifModelDoElseReject(req)(
		_.curry((reject, resolve, AbstractModel)=>
			AbstractModel.findById(id)
			.exec((err, item) => {
				if (err) reject(err);
				resolve(item);
			})
		)
	)
);


const futureList = req => _.compose(
	_.map(getPreferredLanguageVersionForModel(req))
	, _.map(Array)
	, _getById(req)
	, extractId(req)
)();


exports.getById = (req, res) =>
	futureList(req).fork(
		err => sendAPIError(res)(404),
		data => sendAPIResponse(res)(data)
	);

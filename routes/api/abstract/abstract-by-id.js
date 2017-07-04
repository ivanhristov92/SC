/**
 * Created by Game Station on 10.6.2017 г..
 */
// @flow
'use strict';

const _ 		  = require("ramda");
const async 	  = require('async');
const keystone    = require('keystone');
const News 	      = keystone.list('News');
const Awards      = keystone.list('Awards');

const getPreferredLanguageVersion  = require("./common").getPreferredLanguageVersion;
const getPreferredLanguageVersionForModel  = require("./common").getPreferredLanguageVersionForModel;
const sendAPIResponse 			   = require("./common").sendAPIResponse;
const extractModelType 			   = require("./common").extractModelType;
const extractModelKey 			   = require("./common").extractModelKey;


const extractId = req =>
	()=> Promise.resolve(req.params.id);

const _getById = req => id  => {
	
	let AbstractModel = extractModelType(req);
	
	return new Promise((resolve, reject) => {
		AbstractModel.findById(id)
		/**
		 *  @param news: PieceOfNews
		 */
			.exec((err, item) => {
				if (err) return reject(err);
				resolve(item);
			});
	});
};



exports.getById = (req, res) =>
	_.composeP(
		sendAPIResponse(res),
		getPreferredLanguageVersionForModel(req),
		Array,
		_getById(req),
		extractId(req)
	)();
		

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
const sendAPIResponse 			   = require("./common").sendAPIResponse;

const extractModelType = req => {
	switch(req.params.model){
		case "news":
			return News.model;
		case "awards":
			return Awards.model;
		default:
			throw new Error("Unknown Model Type");
	}
};

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
		getPreferredLanguageVersion(req),
		Array,
		_getById(req),
		extractId(req)
	)();
		

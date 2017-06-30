/**
 * Created by Game Station on 10.6.2017 г..
 */
// @flow
'use strict';

const _ 		  = require("ramda");
const async 	  = require('async');
const keystone    = require('keystone');
const News 	      = keystone.list('News');

const getPreferredLanguageVersion = require("../abstract/common").getPreferredLanguageVersion;
const sendAPIResponse = require("../abstract/common").sendAPIResponse;


const extractId = req => 
	()=> Promise.resolve(req.params.id);

const _getById = id  => 
	new Promise((resolve, reject)=> {
		News.model.findById(id)
		/**
		 *  @param news: PieceOfNews
		 */
		.exec((err, news) => {
			if (err) return reject(err);
			resolve(news);
		});
	});
		
exports.getById = (req, res) =>
	_.composeP(
		sendAPIResponse(res),
		getPreferredLanguageVersion(req),
		Array,
		_getById, 
		extractId(req)
	)();
		

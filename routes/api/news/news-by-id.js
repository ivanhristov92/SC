/**
 * Created by Game Station on 10.6.2017 г..
 */
// @flow
'use strict';

const _ 		  = require("ramda");
const async 	  = require('async');
const keystone   = require('keystone');
const News 	  = keystone.list('News');

exports.getById = function( req, res ) {
	return new Promise((resolve, reject)=>{
		News.model.findById(req.params.id)
		/**
		 *  @param news: PieceOfNews
		 */
			.exec( function( err, news ) {
				if (err) return reject(res.apiError('database error', err));
				resolve(res.apiResponse({
					news: news
				}));
			});
	});
};

// @flow
'use strict';

const _ 		  = require("ramda");
const async 	  = require('async');
const keystone   = require('keystone');
const News 	  = keystone.list('News');

exports.getBySlug = function( req, res ) {
	return new Promise((resolve, reject)=>{
		News.model.find({slug: req.params.slug})
		/**
		 *  @param news: Array<PieceOfNews>
		 */
			.exec( function( err, news ) {
				if (err) return reject(res.apiError('database error', err));
				resolve(res.apiResponse({
					news: news
				}));
			});
	});
};


/**
 * Created by Game Station on 1.6.2017 г..
 */
'use strict';

// @flow


var async = require('async'),
	keystone = require('keystone');
var News = keystone.list('News');
exports.model = News.model;

/**
 * type PieceOfNews = {
		_id: string | object,
		slug: string,
		title: string,
		content?: {
			brief?: ?HTML,	
			extended?: HTML	
		} 
	}
 */

/**
 * List News
 */

const getAllNews = (req, res)=>
	new Promise((resolve, reject)=>{
	/**
	 * @param news: Array<PieceOfNews>
	 */
	News.model.find().exec( function( err, news ) {
		if (err) return reject(res.apiError('database error', err));
		resolve(res.apiResponse({
			news: news
		}));
	});
});

const getLastNNews = (req,res)=> N =>
	new Promise((resolve, reject)=>{
	/**
	 * @param news: Array<PieceOfNews>
	 */
	News.model.find()
		.sort('-createdAt')
		.limit(N)
		.exec( function( err, news ) {
		if (err) return reject(res.apiError('database error', err));
		resolve(res.apiResponse({
			news: news
		}));
	});
});

// exports.list = ( req, res ) =>
// 	req.query.last ?
// 	getLastNNews(req, res)(req.query.last) :
// 	getAllNews(req,res);


/**
 * Get News By Id
 */

exports.getById = function( req, res ) {
	return new Promise((resolve, reject)=>{
			News.model.findById(req.params.id)
			/**
			 *  @param news: PieceOfNews
			 */
			.exec( function( err, news ) {
				if (err) return reject(res.apiError('database error', err));
				// TODO transform it
				resolve(res.apiResponse({
					news: news
				}));
			});
	});
}


/**
 * Get News By Slug
 */

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

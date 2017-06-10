// @flow
'use strict';

const _ 		  = require("ramda");
const async 	  = require('async');
const keystone  = require('keystone');
const News 	  = keystone.list('News');

exports.model = News.model;

/**
 * type PieceOfNews = {
		_id: string | object,
		slug: string,
		title: {
			en: string,
			bg: string
		},
		content: {
		
			en:	{
				brief?: ?HTML,	
				extended?: HTML	
			},
			bg: {
				brief?: ?HTML,	
				extended?: HTML
			}
			
		},
		
		featuredImage? CloudinaryImage,
		createdAt: Date
	}
 */

/**
 * List News
 */

exports.getAllNews = ()=>
	new Promise((resolve, reject)=>{
		/**
		 * @param news: Array<PieceOfNews>
		 */
		News.model.find().exec( function( err, news ) {
			if (err) return reject(err);
			resolve(news);
		});
	});


exports.getLastNNews = N => ()=>
	new Promise((resolve, reject)=>{
		/**
		 * @param news: Array<PieceOfNews>
		 */
		News.model.find()
			.sort('-createdAt')
			.limit(N)
			.exec( function( err, news ) {
				if (err) return reject(err);
				resolve(news);
			});
	});

exports.getTheDesiredAmountOfNews = req=>()=>
	req.query.last ?
		getLastNNews(req.query.last) :
		getAllNews;


exports.getEnglishVersion = news=>news; //TODO
exports.getBulgarianVersion = news=>news; //TODO
exports.getPreferredLanguageVersion = (req)=>
	_.equals(req.params.language, "en") ?
		getEnglishVersion	:
		getPreferredLanguageVersion;



exports.sendAPIResponse =  res=>news=>{
	res.apiResponse({
		news
	})
};

exports.list = ( req, res ) =>
	_.compose(
		sendAPIResponse(res),
		getPreferredLanguageVersion(req),
		getTheDesiredAmountOfNews(req)
	)();


// @flow
'use strict';

const _ 		  = require("ramda");
const async 	  = require('async');
const keystone    = require('keystone');
const News 	      = keystone.list('News');

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

const getAllNews = ()=>
	new Promise((resolve, reject)=>{
		/**
		 * @param news: Array<PieceOfNews>
		 */
		News.model.find().exec( function( err, news ) {
			if (err) return reject(err);
			resolve(news);
		});
	});


const getLastNNews = N => ()=>
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

const getTheDesiredAmountOfNews = req=>()=>
	req.query.last ?
	getLastNNews(req.query.last) :
	getAllNews;


const getEnglishVersion = news=>news; //TODO

const getBulgarianVersion = news=>news; //TODO

const getPreferredLanguageVersion = (req)=>
	_.equals(req.params.language, "en") ?
		getEnglishVersion	:
		getPreferredLanguageVersion;



const sendAPIResponse =  res=>news=>{
	res.apiResponse({
		news
	})
};

exports.test = {
	getAllNews,
	getLastNNews,
	getTheDesiredAmountOfNews,
	getEnglishVersion,
	getBulgarianVersion,
	getPreferredLanguageVersion,
	sendAPIResponse
};

exports.list = ( req, res ) =>
	_.compose(
		sendAPIResponse(res),
		getPreferredLanguageVersion(req),
		getTheDesiredAmountOfNews(req)
	)();


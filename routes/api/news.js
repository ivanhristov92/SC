 // @flow
 'use strict';

 const _ 		  = require("ramda");
 const async 	  = require('async');
 const keystone   = require('keystone');
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
exports.list = require("./news/news-list").list;

/**
 * Get News By Id
 */
exports.getById = require("./news/news-by-id").getById;

/**
 * Get News By Slug
 */
exports.getBySlug = require("./news/news-by-slug").getBySlug;
 /**
  * Get News Matching a Query
  */
 exports.getByQuery = require("./news/news-by-query").getByQuery;

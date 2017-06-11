/**
 * Created by Game Station on 10.6.2017 г..
 */
// @flow
'use strict';

const _ 		  = require("ramda");
const async 	  = require('async');
const keystone    = require('keystone');
const News 	      = keystone.list('News');

const getPreferredLanguageVersion = require("./news-list").getPreferredLanguageVersion;
const sendAPIResponse = require("./news-list").sendAPIResponse;


const extractId = req => req.params.id;

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
	_.compose(_getById, extractId)(req)
	.then(news =>{
		_.compose(
			sendAPIResponse(res),
			getPreferredLanguageVersion(req)
		)(news)
	});

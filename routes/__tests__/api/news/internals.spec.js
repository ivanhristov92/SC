/**
 * Created by Game Station on 10.6.2017 г..
 */
'use strict';

const keystone = require("../../../../keystone");
const server   = keystone.app;

const News     = keystone.list('News');
const NewsInt  = require('../../../api/news/news-list').test;
const chai 	   = require("chai");
const expect   = chai.expect;
const should   = chai.should();
const chaiHttp = require('chai-http');

chai.use(chaiHttp);




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


const cleanNews = (done) => {
	News.model.find({})
		.remove(function (err) {
			done();
		});
};

const saveAPiece = (model) => {
	return new Promise((resolve, reject) => {
		return new News.model(model).save(err => {
			if (err) return reject(err);
			return resolve()
		})
	});
};

describe('News module Internal Functions', () => {
	
	describe('news-list', () => {
	
		describe('it should export a "getAllNews" function', () => {

			it('getAllNews should be a function', () => {
				expect(NewsInt.getAllNews).to.be.a("Function")
			});

			it('getAllNews should return a Promise', () => {
				expect(NewsInt.getAllNews().then).to.be.a("Function")
				expect(NewsInt.getAllNews().catch).to.be.a("Function")
			});

			it('getAllNews should get all the news', (done) => {
				saveAPiece({title: {en: "First"}})
				.then(()=>saveAPiece({title: {en: "Second"}}))
				.then(()=>saveAPiece({title: {en: "Third"}}))
				.then(news=>{
					NewsInt.getAllNews()
					.then(news=>{
						news.length.should.be.eql(3);
						done();
					});
				})
				.catch(err=>{
					throw err;
				})
			});
			
		});






		describe('it should export a "getLastNNews" function', () => {

			it('getLastNNews should be a function', () => {
				expect(NewsInt.getLastNNews).to.be.a("Function")
			});

			it('getLastNNews should return a Function', () => {
				expect(NewsInt.getLastNNews()).to.be.a("Function")
			});

			it('getLastNNews should return a Function which returns a Promise', () => {
				expect(NewsInt.getLastNNews()().catch).to.be.a("Function")
				expect(NewsInt.getLastNNews()().then).to.be.a("Function")
			});

			it('getLastNNews should get the last N(2) number of news', (done) => {
				saveAPiece({title: {en: "First"}})
				.then(()=>saveAPiece({title: {en: "Second"}}))
				.then(()=>saveAPiece({title: {en: "Third"}}))
				.then(news=>{
					NewsInt.getLastNNews(2)()
						.then(news=>{
							news.length.should.be.eql(2);
							done();
						});
				})
				.catch(err=>{
					throw err;
				})
			});

			it('getLastNNews should get the last N(6) number of news', (done) => {
				saveAPiece({title: {en: "First"}})
				.then(()=>saveAPiece({title: {en: "Second"}}))
				.then(()=>saveAPiece({title: {en: "Third"}}))
				.then(()=>saveAPiece({title: {en: "4th"}}))
				.then(()=>saveAPiece({title: {en: "5th"}}))
				.then(()=>saveAPiece({title: {en: "6th"}}))
				.then(news=>{
					NewsInt.getLastNNews(6)()
						.then(news=>{
							news.length.should.be.eql(6);
							done();
						});
				})
				.catch(err=>{
					throw err;
				})
			});

			it('getLastNNews should return the last N(3) number of news in the correct order - LIFO', (done) => {
				saveAPiece({title: {en: "First"}})
				.then(()=>saveAPiece({title: {en: "Second"}}))
				.then(()=>saveAPiece({title: {en: "Third"}}))
				.then(()=>saveAPiece({title: {en: "4th"}}))
				.then(()=>saveAPiece({title: {en: "5th"}}))
				.then(()=>saveAPiece({title: {en: "6th"}}))
				.then(news=>{
					NewsInt.getLastNNews(3)()
					.then(news=>{
						news[0].title.en.should.be.eql("6th");
						news[1].title.en.should.be.eql("5th");
						news[2].title.en.should.be.eql("4th");
						done();
					});
				})
				.catch(err=>{
					throw err;
				})
			});

		});




		describe('it should export a "getTheDesiredAmountOfNews" function', () => {

			it('getTheDesiredAmountOfNews should be a function', () => {
				expect(NewsInt.getTheDesiredAmountOfNews).to.be.a("Function")
			});

			it('getTheDesiredAmountOfNews should be return a function', () => {
				expect(NewsInt.getTheDesiredAmountOfNews()).to.be.a("Function")
			});

			it('getTheDesiredAmountOfNews should return the "getLastNNews" function if a number of news is provided', () => {
				let req = {query:{last: 6}};
				expect(NewsInt.getTheDesiredAmountOfNews(req)().toString()).to.be.eql(NewsInt.getLastNNews(6).toString())
			});

			it('getTheDesiredAmountOfNews should return the "getAllNews" function if NO number is specified', () => {
				let req = {query: {}};
				expect(NewsInt.getTheDesiredAmountOfNews(req)().toString()).to.be.eql(NewsInt.getAllNews.toString())
			});

		});

	});
});

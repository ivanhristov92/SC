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
const sinon    = require('sinon');
const _newsFields = require("../../../../models/News")._newsFields;
const JSC 	   = require("jscheck") 
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
		
		beforeEach(cleanNews)
		
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

			it('getTheDesiredAmountOfNews should return the last N news if a number of news is provided', (done) => {
				let req = {query:{last: 2}};
				saveAPiece({title: {en: "First"}})
				.then(()=>saveAPiece({title: {en: "Second"}}))
				.then(()=>saveAPiece({title: {en: "Third"}}))
				.then(()=>{
					 NewsInt.getLastNNews(2)()
					.then(lastTwo=>{
						NewsInt.getTheDesiredAmountOfNews(req)()
						.then(desiredNews => {
							expect(lastTwo.length).to.be.eql(desiredNews.length);
							done();
						})
					})
				})
			});

			it('getTheDesiredAmountOfNews should return the all the news if NO number is specified', (done) => {
				let req = {query:{}};
				saveAPiece({title: {en: "First"}})
				.then(()=>saveAPiece({title: {en: "Second"}}))
				.then(()=>saveAPiece({title: {en: "Third"}}))
				.then(()=>{
					NewsInt.getAllNews()
					.then(all=>{
						NewsInt.getTheDesiredAmountOfNews(req)()
							.then(desiredNews => {
								expect(all.length).to.be.eql(desiredNews.length);
								done();
							});
					});
				})
			});

		});



		describe('it should export a "getEnglishVersion" function', () => {
			beforeEach(cleanNews)

			it('getEnglishVersion should be a function', () => {
				expect(NewsInt.getEnglishVersion).to.be.a("Function")
			});

			it('getEnglishVersion should return an array', () => {
				let news = [{title: "aa"}, {title: "aa"}, {title: "aa"}];
				let _news = NewsInt.getEnglishVersion(news);
				expect(_news).to.be.a("Array");
				expect(_news.length).to.be.eql(news.length);
			});

			it('getEnglishVersion should return all items without any "en" or "bg" fields', () => {
				let _news = [{title: {bg: "zaglavie", en: "title"}}];
				let news = NewsInt.getEnglishVersion(_news);
				news.map(piece=>{
					_newsFields.map(key=>{
						
						let value = piece[key];
						expect(key).not.to.be.eql("en");
						expect(key).not.to.be.eql("bg");
						if(value){
							expect(value).not.to.have.property("en");
							expect(value).not.to.have.property("bg");
						}
					});
				})
			});

			it('getEnglishVersion should return the correct field values', () => {
				let _news = [{title: {bg: "zaglavie", en: "title"}, content: {en: "aa", bg: "bb"}}];
				let news = NewsInt.getEnglishVersion(_news);
				expect(news[0].title).to.be.eql("title");
				expect(news[0].content).to.be.eql("aa");
			});

		});





		describe('it should export a "getBulgarianVersion" function', () => {

			it('getBulgarianVersion should be a function', () => {
				expect(NewsInt.getBulgarianVersion).to.be.a("Function")
			});

			it('getBulgarianVersion should return an array', () => {
				let news = [{}, {}, {}];
				let _news = NewsInt.getBulgarianVersion(news)
				expect(_news).to.be.a("Array");
				expect(_news.length).to.be.eql(news.length);
			});

			it('getBulgarianVersion should return all items without any "en" or "bg" fields', () => {
				let _news = [{title: {bg: "zaglavie", en: "title"}}];
				let news = NewsInt.getEnglishVersion(_news);
				news.map(piece=>{
					Object.keys(piece).map(key=>{
						let value = piece[key];
						expect(key).not.to.be.eql("en");
						expect(key).not.to.be.eql("bg");
						if(value){
							expect(value).not.to.have.property("en");
							expect(value).not.to.have.property("bg");
						}
					});
				})
			});

			it('getBulgarianVersion should return the correct field values', () => {
				let _news = [{title: {bg: "zaglavie", en: "title"}, content: {en: "aa", bg: "bb"}}];
				let news = NewsInt.getBulgarianVersion(_news);
				expect(news[0].title).to.be.eql("zaglavie");
				expect(news[0].content).to.be.eql("bb");
			});

		});



		describe('it should export a "getPreferredLanguageVersion" function', () => {

			it('getPreferredLanguageVersion should be a function', () => {
				expect(NewsInt.getPreferredLanguageVersion).to.be.a("Function")
			});

			it('getPreferredLanguageVersion should return a function', () => {
				let req = {params: {}}
				expect(NewsInt.getPreferredLanguageVersion(req)).to.be.a("Function")
			});

			it('getPreferredLanguageVersion should NOT return the "getEnglishVersion" function if the language is specified as "en"', () => {
				let req = {params:{language: "en"}};
				expect(NewsInt.getPreferredLanguageVersion(req).toString()).not.to.be.eql(NewsInt.getEnglishVersion.toString())
			});

			it('getTheDesiredAmountOfNews should NOT return the "getBulgarianVersion" function if the language is specified as "bg"', () => {
				let req = {params:{language: "en"}};
				expect(NewsInt.getPreferredLanguageVersion(req).toString()).not.to.be.eql(NewsInt.getBulgarianVersion.toString())
			});

		});




		describe('it should export a "sendAPIResponse" function', () => {

			it('sendAPIResponse should be a function', () => {
				expect(NewsInt.sendAPIResponse).to.be.a("Function")
			});

			it('sendAPIResponse should return a function', () => {
				expect(NewsInt.sendAPIResponse()).to.be.a("Function")
			});

			it('sendAPIResponse should call "res.apiResponse"', () => {
				let res = {apiResponse: sinon.spy()};
				let news = [{title: {en: "aa", bg: "bg"}}, {title: {en: "aa2", bg: "bg2"}}];
				NewsInt.sendAPIResponse(res)(news);
				expect(res.apiResponse.calledOnce).to.be.eql(true);
			});

			it('sendAPIResponse should call "res.apiResponse" with the right arguments', () => {
				let res = {apiResponse: sinon.spy()};
				let news = [{title: {en: "aa", bg: "bg"}}, {title: {en: "aa2", bg: "bg2"}}];
				NewsInt.sendAPIResponse(res)(news);
				expect(res.apiResponse.calledWith({news})).to.be.eql(true);
			});
		});
	});
});

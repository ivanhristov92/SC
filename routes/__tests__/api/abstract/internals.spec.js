/**
 * Created by Game Station on 10.6.2017 г..
 */
'use strict';


const keystone = require("../../../../keystone");
const server   = keystone.app;

const News     = keystone.list('News');
const NewsInt  = require('../../../api/abstract/abstract-list').test;
const chai 	   = require("chai");
const expect   = chai.expect;
const should   = chai.should();
const chaiHttp = require('chai-http');
const sinon    = require('sinon');
const _newsFields = require("../../../../models/News")._newsFields;
const JSC 	   = require("jscheck");

const AbstractQuery = require("../../../api/abstract/abstract-by-query");

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

describe('Abstract module Internal Functions', () => {
	
	describe('abstract-list', () => {

		let AbstractList = require("../../../api/abstract/abstract-list").test;

		beforeEach(cleanNews)
		let req = {
			params: {
				model: "news"
			}
		};
		describe('it should export a "getAll" function', () => {


			it('getAll should be a function', () => {
				expect(AbstractList.getAll).to.be.a("Function")
			});

			it('getAll should return a Future', () => {
				expect(AbstractList.getAll(req)().fork).to.be.a("Function")
			});

			it('getAll should get all items', (done) => {
				saveAPiece({title: {en: "First"}})
					.then(() => saveAPiece({title: {en: "Second"}}))
					.then(() => saveAPiece({title: {en: "Third"}}))
					.then(news => {
						AbstractList.getAll(req)()
							.fork(err=>{throw err;}, news=>{
								news.length.should.be.eql(3);
								done();
							});
					})
			});

		});


		describe('it should export a "getLastNItems" function', () => {

			it('getLastNItems should be a function', () => {
				expect(AbstractList.getLastNItems).to.be.a("Function")
			});

			it('getLastNNews should return a Future', () => {
				expect(AbstractList.getLastNItems(req, 3)().fork).to.be.a("Function")
			});

			it('getLastNItems should get the last N(2) number of abstract', (done) => {
				saveAPiece({title: {en: "First"}})
					.then(() => saveAPiece({title: {en: "Second"}}))
					.then(() => saveAPiece({title: {en: "Third"}}))
					.then(news => {
						AbstractList.getLastNItems(req, 2)()
							.fork(err=>{throw err},
								news => {
								news.length.should.be.eql(2);
								done();
							});
					})
			});

			it('getLastNItems should get the last N(6) number of abstract', (done) => {
				saveAPiece({title: {en: "First"}})
					.then(() => saveAPiece({title: {en: "Second"}}))
					.then(() => saveAPiece({title: {en: "Third"}}))
					.then(() => saveAPiece({title: {en: "4th"}}))
					.then(() => saveAPiece({title: {en: "5th"}}))
					.then(() => saveAPiece({title: {en: "6th"}}))
					.then(news => {
						AbstractList.getLastNItems(req, 6)()
							.fork(err=>{throw err},
								news => {
								news.length.should.be.eql(6);
								done();
							});
					})
			});

			it('getLastNItems should return the last N(3) number of abstract in the correct order - LIFO', (done) => {
				saveAPiece({title: {en: "First"}})
					.then(() => saveAPiece({title: {en: "Second"}}))
					.then(() => saveAPiece({title: {en: "Third"}}))
					.then(() => saveAPiece({title: {en: "4th"}}))
					.then(() => saveAPiece({title: {en: "5th"}}))
					.then(() => saveAPiece({title: {en: "6th"}}))
					.then(news => {
						AbstractList.getLastNItems(req, 3)()
							.fork(err=>{throw err},
								news => {
								news[0].title.en.should.be.eql("6th");
								news[1].title.en.should.be.eql("5th");
								news[2].title.en.should.be.eql("4th");
								done();
							});
					})
			});

			it("getLastNItems should return the last N(3) number of abstract with a negative number query", (done) => {
				saveAPiece({title: {en: "First"}})
					.then(() => saveAPiece({title: {en: "Second"}}))
					.then(() => saveAPiece({title: {en: "Third"}}))
					.then(() => saveAPiece({title: {en: "4th"}}))
					.then(() => saveAPiece({title: {en: "5th"}}))
					.then(() => saveAPiece({title: {en: "6th"}}))
					.then(news => {
						return AbstractList.getLastNItems(req, -3)()
							.fork(err=> {throw err},
								news => {
								expect(news.length).to.be.eql(3);
								done();
							});
					})
			});

			it("getLastNItems should return all abstract with a stringy query for N", (done) => {
				saveAPiece({title: {en: "First"}})
					.then(() => saveAPiece({title: {en: "Second"}}))
					.then(() => saveAPiece({title: {en: "Third"}}))
					.then(() => saveAPiece({title: {en: "4th"}}))
					.then(() => saveAPiece({title: {en: "5th"}}))
					.then(() => saveAPiece({title: {en: "6th"}}))
					.then(() => {
						return AbstractList.getLastNItems(req, "sss")()
							.fork(err=>{throw err},
								news => {
								expect(news.length).to.be.eql(6);
								done();
							})
					})
			});

			it("getLastNItems should return all abstract with a stringy number query for N", (done) => {
				saveAPiece({title: {en: "First"}})
					.then(() => saveAPiece({title: {en: "Second"}}))
					.then(() => saveAPiece({title: {en: "Third"}}))
					.then(() => saveAPiece({title: {en: "4th"}}))
					.then(() => saveAPiece({title: {en: "5th"}}))
					.then(() => saveAPiece({title: {en: "6th"}}))
					.then(news => {
						return AbstractList.getLastNItems(req, "4")()
							.fork(err=>{throw err},
								news => {
								expect(news.length).to.be.eql(4);
								done();
							})
					})
			});


			// it("JSC", ()=>{
			//	
			// 	let fails = false;
			// 	console.log("       ----------------------------")
			// 	function le(a, b) {
			// 		return a <= b;
			// 	}
			//
			// 	JSC.on_fail(function(object){
			// 		fails = true;
			// 	});
			//	
			// 	JSC.on_report((a)=>{
			// 		console.log("report", a)
			// 	})
			// 	JSC.test(
			// 		"Less than",
			// 		function (verdict, a, b) {
			// 			return verdict(le(a, b));
			// 		},
			// 		[
			// 			JSC.integer(10),
			// 			JSC.integer(20)
			// 		],
			// 		function (a, b) {
			// 			if (a < b) {
			// 				return 'lt';
			// 			} else if (a === b) {
			// 				return 'eq';
			// 			} else {
			// 				return false;
			// 			}
			// 		}
			// 	);
			//	
			// 	expect(fails).to.be.eql(false);
			// })

		});


		describe('it should export a "getTheDesiredAmountOfItems" function', () => {

			it('getTheDesiredAmountOfItems should be a function', () => {
				expect(AbstractList.getTheDesiredAmountOfItems).to.be.a("Function")
			});

			it('getTheDesiredAmountOfItems should be return a function', () => {
				expect(AbstractList.getTheDesiredAmountOfItems(req)).to.be.a("Function")
			});

			it('getTheDesiredAmountOfItems should return the last N abstract if a number of abstract is provided', (done) => {
				let req = {
					params: {
						model: "news"
					},
					query: {
						last: 2
					}
				};

				saveAPiece({title: {en: "First"}})
					.then(() => saveAPiece({title: {en: "Second"}}))
					.then(() => saveAPiece({title: {en: "Third"}}))
					.then(() => {
						AbstractList.getLastNItems(req, 2)()
							.fork(err=>{throw err}, 
								lastTwo => {
								AbstractList.getTheDesiredAmountOfItems(req)()
									.fork(err=>{throw err},
										desiredNews => {
										expect(lastTwo.length).to.be.eql(desiredNews.length);
										done();
									})
							})
					})
			});

			it('getTheDesiredAmountOfItems should return the all the abstract if NO number is specified', (done) => {
				let req = {
					params: {
						model: "news"
					},
					query: {}
				};
				saveAPiece({title: {en: "First"}})
					.then(() => saveAPiece({title: {en: "Second"}}))
					.then(() => saveAPiece({title: {en: "Third"}}))
					.then(() => {
						AbstractList.getAll(req)()
							.fork(err=>{throw err},
								all => {
								AbstractList.getTheDesiredAmountOfItems(req)()
									.fork(err=>{throw err},
										desiredNews => {
										expect(all.length).to.be.eql(desiredNews.length);
										done();
									});
							});
					})
			});

		});

	});


		




	
	
	
	
	// describe("'abstract-by-query'", ()=>{
	// 	beforeEach(cleanNews)
	//	
	// 	describe("it should export a _getAll internal function", ()=>{
	//		
	// 		it("_getAll should be a function", ()=>{
	// 			expect(AbstractQuery._getAll).to.be.a("function")
	// 		});
    //
	// 		it("_getAll should return a Promise", ()=>{
	// 			expect(AbstractQuery._getAll().then).to.be.a("function")
	// 			expect(AbstractQuery._getAll().catch).to.be.a("function")
	// 		});
    //
	// 		it("_getAll should resolve to all abstract", (done)=>{
	// 			saveAPiece({title: {en: "First"}})
	// 				.then(()=>saveAPiece({title: {en: "Second Hand"}}))
	// 				.then(()=>saveAPiece({title: {en: "Third Party"}}))
	// 				.then(()=>saveAPiece({title: {en: "4th July"}}))
	// 				.then(()=>saveAPiece({title: {en: "5th Amendment"}}))
	// 				.then(()=>saveAPiece({title: {en: "6th Sense"}}))
	// 				.then(()=>{
	// 					AbstractQuery._getAll()
	// 						.then(news=>{
	// 							news.length.should.be.eql(6);
	// 							done();
	// 						});
	// 				});
	// 		});
    //
	// 		it("getAllAndFilterByLanguage should be a function", ()=>{
	// 			expect(AbstractQuery.getAllAndFilterByLanguage).to.be.a("function")
	// 		});
	//		
    //
	// 		it("getAllAndFilterByLanguage should filter correctly", (done)=>{
	// 			saveAPiece({title: {en: "First"}})
	// 				.then(()=>saveAPiece({title: {en: "Second Hand", bg: "Заглавие"}}))
	// 				.then(()=>saveAPiece({title: {en: "Third Party", bg: "Трета страна"}}))
	// 				.then(()=>{
	// 					let req = {
	// 						params: {
	// 							language: "bg"
	// 						}
	// 					};
	// 					AbstractQuery.getAllAndFilterByLanguage(req)()
	// 						.then(news=>{
	// 							news.length.should.be.eql(3);
	// 							news[0].title.should.be.eql("");
	// 							news[1].title.should.be.eql("Заглавие");
	// 							news[2].title.should.be.eql("Трета страна");
	// 							done();
	// 						});
	// 				})
	// 		});
    //
    //
	// 		it("_generateFuzzyOptions should be a function", ()=>{
	// 			expect(AbstractQuery._generateFuzzyOptions).to.be.a("function")
	// 		});
    //
	// 		it("_generateFuzzyOptions should generate correctly", ()=>{
	//		
	// 			expect(AbstractQuery._generateFuzzyOptions()).to.be.eql({
	// 				shouldSort: true,
	// 				threshold: 0.2,
	// 				keys: [
	// 					"title"
	// 				]
	// 			});
    //
	// 			let req2 = {
	// 				params: {
	// 					language: "en"
	// 				}
	// 			};
	//			
	// 			expect(AbstractQuery._generateFuzzyOptions(req2)).to.be.eql({
	// 				shouldSort: true,
	// 				threshold: 0.2,
	// 				keys: [
	// 					"title"
	// 				]
	// 			})
	//			
	// 		});
    //
	//		
	// 		it("_extractQuery should be a function", ()=>{
	// 			expect(AbstractQuery._extractQuery).to.be.a("function")
	// 		});
    //
	// 		it("_extractQuery should return correctly", ()=>{
	// 			let req = {
	// 				query: {
	// 					text: "some text"
	// 				}
	// 			};
	// 			expect(AbstractQuery._extractQuery(req)).to.be.a("function");
	// 			expect(AbstractQuery._extractQuery(req)()).to.be.eql("some text")
	// 		});
	//		
	// 		it("_doFuzzySearch should be a function", ()=>{
	// 			expect(AbstractQuery._doFuzzySearch).to.be.a("function")
	// 		});
	//		
	// 		it("_doFuzzySearch should do a search", (done)=>{
	// 			let req = {
	// 				query: {
	// 					text: "заг"
	// 				},
	// 				params: {
	// 					language: "bg"
	// 				}
	// 			};
    //
	// 			saveAPiece({title: {en: "First"}})
	// 				.then(()=>saveAPiece({title: {en: "Second Hand", bg: "Заглавие"}}))
	// 				.then(()=>saveAPiece({title: {en: "Third Party", bg: "Трета страна"}}))
	// 				.then(()=>{
	// 					AbstractQuery.getAllAndFilterByLanguage(req)()
	// 						.then(news=>{
	// 							news.length.should.be.eql(3);
	// 							let results = AbstractQuery._doFuzzySearch(
	// 								AbstractQuery._generateFuzzyOptions(req),
	// 								news,
	// 								"заг"
	// 							);
	//							
	// 							results[0].title.should.be.eql("Заглавие")
	// 							done();
	// 						});
	// 				});
	// 		});
    //
	// 		it("_doSearch should be a function", ()=>{
	// 			expect(AbstractQuery._doSearch).to.be.a("function")
	// 		});
    //
	// 		it("_doSearch should extract the query and do the search", (done)=>{
	// 			let req = {
	// 				query: {
	// 					text: "заг"
	// 				},
	// 				params: {
	// 					language: "bg"
	// 				}
	// 			};
    //
	// 			saveAPiece({title: {en: "First"}})
	// 				.then(()=>saveAPiece({title: {en: "Second Hand", bg: "Заглавие"}}))
	// 				.then(()=>saveAPiece({title: {en: "Third Party", bg: "Трета страна"}}))
	// 				.then(()=>{
	// 					AbstractQuery.getAllAndFilterByLanguage(req)()
	// 						.then(news=>{
	// 							news.length.should.be.eql(3);
	// 							let results = AbstractQuery._doSearch(req)(news);
	// 							results[0].title.should.be.eql("Заглавие");
	// 							done();
	// 						});
	// 				});
	// 		});
	//		
	//		
	//		
	//		
	// 	});
	//	
	// })
});

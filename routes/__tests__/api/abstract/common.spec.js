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
const _newsFields = require("../../../../models/News")._instanceFields;
const JSC 	   = require("jscheck");

chai.use(chaiHttp);

const Common = require("../../../api/abstract/common").test;

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


describe("Common functions", ()=>{
	
	describe('it should export a "getEnglishVersion" function', () => {
		beforeEach(cleanNews)
	
		it('getEnglishVersion should be a function', () => {
			expect(Common.getEnglishVersion).to.be.a("Function")
		});
	
		it('getEnglishVersion should return an array', () => {
			let news = [{title: "aa"}, {title: "aa"}, {title: "aa"}];
			let _news = Common.getEnglishVersion("News")(news);
			expect(_news).to.be.a("Array");
			expect(_news.length).to.be.eql(news.length);
		});
	
		it('getEnglishVersion should return all items without any "en" or "bg" fields', () => {
			let _news = [{title: {bg: "zaglavie", en: "title"}}];
			let news = Common.getEnglishVersion("News")(_news);
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
			let news = Common.getEnglishVersion("News")(_news);
			expect(news[0].title).to.be.eql("title");
			expect(news[0].content).to.be.eql("aa");
		});
	
	});
	
	
	
	
	
	describe('it should export a "getBulgarianVersion" function', () => {
	
		it('getBulgarianVersion should be a function', () => {
			expect(Common.getBulgarianVersion).to.be.a("Function")
		});
	
		it('getBulgarianVersion should return an array', () => {
			let news = [{}, {}, {}];
			let _news = Common.getBulgarianVersion("News")(news)
			expect(_news).to.be.a("Array");
			expect(_news.length).to.be.eql(news.length);
		});
	
		it('getBulgarianVersion should return all items without any "en" or "bg" fields', () => {
			let _news = [{title: {bg: "zaglavie", en: "title"}}];
			let news = Common.getEnglishVersion("News")(_news);
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
			let news = Common.getBulgarianVersion("News")(_news);
			expect(news[0].title).to.be.eql("zaglavie");
			expect(news[0].content).to.be.eql("bb");
		});
	
	});
	
	
	describe('it should export a "getPreferredLanguageVersion" function', () => {
	
		it('getPreferredLanguageVersion should be a function', () => {
			expect(Common.getPreferredLanguageVersion).to.be.a("Function")
		});
	
		it('getPreferredLanguageVersion should return a function', () => {
			let req = {params: {}}
			expect(Common.getPreferredLanguageVersion(req)).to.be.a("Function")
		});
	
		it('getPreferredLanguageVersion should NOT return the "getEnglishVersion" function if the language is specified as "en"', () => {
			let req = {params:{language: "en"}};
			expect(Common.getPreferredLanguageVersion(req).toString()).not.to.be.eql(Common.getEnglishVersion.toString())
		});
	
		// it('getTheDesiredAmountOfItems should NOT return the "getBulgarianVersion" function if the language is specified as "bg"', () => {
		// 	let req = {params:{language: "en"}};
		// 	expect(NewsInt.getPreferredLanguageVersion(req).toString()).not.to.be.eql(NewsInt.getBulgarianVersion.toString())
		// });
	
	});
	
	
	
	describe('it should export a "sendAPIResponse" function', () => {
	
		it('sendAPIResponse should be a function', () => {
			expect(Common.sendAPIResponse).to.be.a("Function")
		});
	
		it('sendAPIResponse should return a function', () => {
			expect(Common.sendAPIResponse()).to.be.a("Function")
		});
	
		it('sendAPIResponse should call "res.apiResponse"', () => {
			let res = {apiResponse: sinon.spy()};
			let news = [{title: {en: "aa", bg: "bg"}}, {title: {en: "aa2", bg: "bg2"}}];
			Common.sendAPIResponse(res)(news);
			expect(res.apiResponse.calledOnce).to.be.eql(true);
		});
	
		it('sendAPIResponse should call "res.apiResponse" with the right arguments', () => {
			let res = {apiResponse: sinon.spy()};
			let news = [{title: {en: "aa", bg: "bg"}}, {title: {en: "aa2", bg: "bg2"}}];
			Common.sendAPIResponse(res)(news);
			expect(res.apiResponse.calledWith({items: news})).to.be.eql(true);
		});
	});
});



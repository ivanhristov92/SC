/**
 * Created by Game Station on 1.6.2017 г..
 */

'use strict';
var keystone = require("../../../../keystone");
var server = keystone.app;

const News = require('../../../api/news');
const chai = require("chai");
const expect = chai.expect;
const should = chai.should();
const chaiHttp = require('chai-http');

chai.use(chaiHttp);

describe('News module', () => {
	const cleanNews = (done) => {
		News.model.find({})
		.remove(function(err) {
			done();
		});
	};
	
	const saveAPiece = (model)=> {
		return new Promise((resolve, reject) => {
			return new News.model(model).save(err => {
				if (err) return reject(err);
				return resolve()
			})
		});
	};
	
	describe('it should export a "list" function', () => {

		beforeEach(cleanNews);

		it('should export a "list" function', () => {
			expect(News.list).to.be.a("Function")
		});

		it('it should return a Promise', (done) => {
			let newsListResult = chai.request(server)
				.get('/api/en/news')
				.end((err, res) => {
					expect(newsListResult.then).to.be.a('Function')
					expect(newsListResult.catch).to.be.a('Function')
				done();
			});
		});

		it('it should GET all the news', (done) => {
			chai.request(server)
			.get('/api/en/news')
			.end((err, res) => {

				res.should.have.status(200);
				expect(res.body).to.be.an('object');
				expect(res.body).to.have.property('news');
				expect(res.body.news).to.be.a('array');
				expect(res.body.news.length).to.be.eql(0);
				done();
			});
		});



		it('it should GET all the news after adding "new with title only"', (done) => {
			
	
			saveAPiece({
				title: {
					en: "Some title",
					bg: "Nqkakvo zaglavie"
				}
			})
			.then(()=>{
				// post has been saved	
				chai.request(server)
					.get('/api/en/news')
					.end((err, res) => {
					expect(res.body.news.length).to.be.eql(1);
				let pieceOfNews = res.body.news[0];
					pieceOfNews.should.have.property("title");
					done();
				});
		
			});
		});

		it('it should GET all the news after adding "new with title and content"', (done) => {
			let newNews = new News.model({
				title: {en:'New News'},
				content: {
					en: "aaa",
				}
			});

			newNews.save(function(err) {
				// post has been saved	
				chai.request(server)
				.get('/api/en/news')
				.end((err, res) => {
					expect(res.body.news.length).to.be.eql(1);
					let pieceOfNews = res.body.news[0];
					pieceOfNews.should.have.property("title");
					pieceOfNews.should.have.property("content");
					pieceOfNews.content.should.be.eql("aaa");
					done();
				});

			});
		});

		it("should respond to query params and return the 3 latest news", (done)=>{

			Promise.all([
				saveAPiece({title: {en: "first"}}),
				saveAPiece({title: {en: "second"}}),
				saveAPiece({title: {en: "third"}}),
			])
			.then(()=> saveAPiece({title: {en: "fourth"}}))
			.then(()=> saveAPiece({title: {en: "fifth"}}))
			.then(()=> saveAPiece({title: {en: "sixth"}}))
			.then(resp=>{
				chai.request(server)
				.get('/api/en/news?last=3')
				.end((err,res)=>{
					expect(res.body.news.length).to.be.eql(3);
					expect(res.body.news[0].title).to.be.eql("sixth");
					expect(res.body.news[1].title).to.be.eql("fifth");
					expect(res.body.news[2].title).to.be.eql("fourth");
					done();
				})

			});

		});

		it("should respond to query params and return the 4 latest news", (done)=>{

			Promise.all([
				saveAPiece({title: {en:"first", bg: ""}}),
				saveAPiece({title: {en:"second", bg: ""}})
			])
			.then(()=> saveAPiece({title: {en:"third", bg: ""}}))
			.then(()=> saveAPiece({title: {en:"fourth", bg: ""}}))
			.then(()=> saveAPiece({title: {en:"fifth", bg: ""}}))
			.then(()=> saveAPiece({title: {en:"sixth", bg: ""}}))
			.then(resp=>{
					chai.request(server)
						.get('/api/en/news?last=4')
						.end((err,res)=>{
							expect(res.body.news.length).to.be.eql(4);
							expect(res.body.news[0].title).to.be.eql("sixth");
							expect(res.body.news[1].title).to.be.eql("fifth");
							expect(res.body.news[2].title).to.be.eql("fourth");
							expect(res.body.news[3].title).to.be.eql("third");
							done();
						})

				});

		})
		
	});
	
	describe("it should export a 'getById' function", ()=>{

		beforeEach(cleanNews);

		it('should export a "getById" function', () => {
			expect(News.getById).to.be.a("Function")
		});


		it('it should get a single piece of news EN', (done) => {

			let newNews = new News.model({
				title: {en:'New News', bg: "Novi Novini"},
			});

			new Promise((resolve, reject)=>{
				newNews.save(function(err, post) {
					if(err) reject(err);
					const id = post._id;
					resolve(id);				
				});
			})
			.then(id=>{
				chai.request(server)
				.get(`/api/en/news/id/${id}`)
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.be.an("object");
					res.body.should.have.property("news");
					res.body.news.should.be.an("array");
					res.body.news.length.should.be.eql(1);
					res.body.news[0].should.have.property("title");
					res.body.news[0].title.should.be.eql("New News");
					res.body.news[0].should.have.property("_id");
					res.body.news[0]._id.should.be.eql(id.toString());
					done();
				});	
			})
		});

		it('it should get a single piece of news BG', (done) => {

			let newNews = new News.model({
				title: {en:'New News', bg: "Zaglavie"},
			});

			new Promise((resolve, reject)=>{
				newNews.save(function(err, post) {
					if(err) reject(err);
					const id = post._id;
					resolve(id);
				});
			})
				.then(id=>{
					chai.request(server)
						.get(`/api/bg/news/id/${id}`)
						.end((err, res) => {
							res.should.have.status(200);
							res.body.news.length.should.be.eql(1);
							res.body.news[0].title.should.be.eql("Zaglavie");
							res.body.news[0].should.have.property("_id");
							res.body.news[0]._id.should.be.eql(id.toString());
							done();
						});
				})
		});
	});
    
	
	
	
	describe("it should export a 'getBySlug' function", ()=>{

		beforeEach(cleanNews);

		it('should export a "getBySlug" function', () => {
			expect(News.getBySlug).to.be.a("Function")
		});

		it('it should get a single piece of news', (done) => {

			let newNews = new News.model({
				title: {en:'New News'},
			});

			new Promise((resolve, reject)=>{
				newNews.save(function(err, post) {
					if(err) reject(err);
					const slug = post.slug;
					resolve(slug);
				});
			})
			.then(slug=>{
				chai.request(server)
				.get(`/api/en/news/${slug}`)
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.be.an("object");
					res.body.should.have.property("news");
					res.body.news.should.be.an("array");
					res.body.news.length.should.be.eql(1);

					let pieceOfNews = res.body.news[0];
					pieceOfNews.should.have.property("title");
					pieceOfNews.should.have.property("slug");
					pieceOfNews.slug.should.be.eql("new-news");
					done();
				});
			})
			.catch(err=>{throw err})

		});

	})




	describe("it should export a getByQuery function", ()=>{
		beforeEach(cleanNews);
		after(cleanNews);

		const getByQuery = require("../../../api/news").getByQuery;
		const _getByQuery = getByQuery;
		
		it("getByQuery should be a function", ()=>{
			expect(getByQuery).to.be.a("function")
		});

		it("getByQuery should return results", (done)=>{
			saveAPiece({title: {en: "First"}})
				.then(()=>saveAPiece({title: {en: "Second Hand"}}))
				.then(()=>saveAPiece({title: {en: "Third Party"}}))
				.then(()=>saveAPiece({title: {en: "4th July"}}))
				.then(()=>saveAPiece({title: {en: "5th Amendment"}}))
				.then(()=>saveAPiece({title: {en: "6th Sense"}}))
				.then(()=>saveAPiece({title: {en: "7th Sense"}}))
				.then(news=>{
					chai.request(server)
						.get('/api/en/search?text=PARty')
						.end((err, res) => {
							if(err) throw err;
							expect(res.body.news.length).to.be.eql(1);
							expect(res.body.news[0].title).to.be.eql("Third Party");
							done();
						});
				})
				.catch(err=>{
					throw err;
				})
		})



		it("_getByQuery should get ('4th') the closest matching ('4th July')", (done)=>{
			saveAPiece({title: {en: "First"}})
				.then(()=>saveAPiece({title: {en: "Second Hand"}}))
				.then(()=>saveAPiece({title: {en: "Third Party"}}))
				.then(()=>saveAPiece({title: {en: "4th July"}}))
				.then(()=>saveAPiece({title: {en: "5th Amendment"}}))
				.then(()=>saveAPiece({title: {en: "6th Sense"}}))
				.then(news=>{
					chai.request(server)
						.get('/api/en/search?text=4th')
						.end((err, res) => {
							if(err) throw err;
							expect(res.body.news.length).to.be.eql(1);
							expect(res.body.news[0].title).to.be.eql("4th July");
							done();
						});
				})
				.catch(err=>{
					throw err;
				})

		});

		it("_getByQuery should get ('Hand') the closest matching ('Second Hand')", (done)=>{
			saveAPiece({title: {en: "First"}})
				.then(()=>saveAPiece({title: {en: "Second Hand"}}))
				.then(()=>saveAPiece({title: {en: "Third Party"}}))
				.then(()=>saveAPiece({title: {en: "4th July"}}))
				.then(()=>saveAPiece({title: {en: "5th Amendment"}}))
				.then(()=>saveAPiece({title: {en: "6th Sense"}}))
				.then(()=>saveAPiece({title: {en: "7th Sense"}}))
				.then(news=>{
					chai.request(server)
						.get('/api/en/search?text=Hand')
						.end((err, res) => {
							if(err) throw err;
							expect(res.body.news.length).to.be.eql(1);
							expect(res.body.news[0].title).to.be.eql("Second Hand");
							done();
						});
				})
				.catch(err=>{
					throw err;
				})
		});


		it("_getByQuery should get ('sense') the closest matching ('7th Sense', '6th Sense' )", (done)=>{
			saveAPiece({title: {en: "First"}})
				.then(()=>saveAPiece({title: {en: "Second Hand"}}))
				.then(()=>saveAPiece({title: {en: "Third Party"}}))
				.then(()=>saveAPiece({title: {en: "4th July"}}))
				.then(()=>saveAPiece({title: {en: "5th Amendment"}}))
				.then(()=>saveAPiece({title: {en: "6th Sense"}}))
				.then(()=>saveAPiece({title: {en: "7th Sense"}}))
				.then(news=>{
					chai.request(server)
						.get('/api/en/search?text=sense')
						.end((err, res) => {
							if(err) throw err;

							res.body.news.length.should.be.eql(2);
							let titles = {
								[res.body.news[0].title]: [res.body.news[0].title] ,
								[res.body.news[1].title]: [res.body.news[1].title]
							};
							expect(titles).to.have.property("7th Sense");
							expect(titles).to.have.property("6th Sense");
							done();
						});
				})
				.catch(err=>{
					throw err;
				})
		});


		it("_getByQuery should get ('PARTY') the closest matching ('Third Party' )", (done)=>{
			saveAPiece({title: {en: "First"}})
				.then(()=>saveAPiece({title: {en: "Second Hand"}}))
				.then(()=>saveAPiece({title: {en: "Third Party"}}))
				.then(()=>saveAPiece({title: {en: "4th July"}}))
				.then(()=>saveAPiece({title: {en: "5th Amendment"}}))
				.then(()=>saveAPiece({title: {en: "6th Sense"}}))
				.then(()=>saveAPiece({title: {en: "7th Sense"}}))
				.then(news=>{

					chai.request(server)
						.get('/api/en/search?text=PARTY')
						.end((err, res) => {
							if(err) throw err;
							expect(res.body.news.length).to.be.eql(1);
							expect(res.body.news[0].title).to.be.eql("Third Party");
							done();
						});
				})
				.catch(err=>{
					throw err;
				})
		});

	})
});

// TODO IMAGES

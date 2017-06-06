/**
 * Created by Game Station on 1.6.2017 г..
 */

'use strict';
var keystone = require("../../../keystone");
var server = keystone.app;

const News = require('../../api/news');
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
				.get('/api/news')
				.end((err, res) => {
					expect(newsListResult.then).to.be.a('Function')
					expect(newsListResult.catch).to.be.a('Function')
				done();
			});
		});

		it('it should GET all the news', (done) => {
			chai.request(server)
			.get('/api/news')
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
			let newNews = new News.model({
				title: 'New News',
			});
	
			newNews.save(function(err) {
				// post has been saved	
				chai.request(server)
					.get('/api/news')
					.end((err, res) => {
					expect(res.body.news.length).to.be.eql(1);
				let pieceOfNews = res.body.news[0];
					pieceOfNews.should.have.property("title");
					pieceOfNews.should.not.have.property("content");
					done();
				});
		
			});
		});

		it('it should GET all the news after adding "new with title and content"', (done) => {
			let newNews = new News.model({
				title: 'New News',
				content: {
					brief: "aaa",
					extended: "ooooo"
				}
			});

			newNews.save(function(err) {
				// post has been saved	
				chai.request(server)
				.get('/api/news')
				.end((err, res) => {
					expect(res.body.news.length).to.be.eql(1);
					let pieceOfNews = res.body.news[0];
					pieceOfNews.should.have.property("title");
					pieceOfNews.should.have.property("content");
					pieceOfNews.content.should.be.an("object");
					pieceOfNews.content.should.have.property("brief");
					pieceOfNews.content.should.have.property("extended");
					done();
				});
				
			});
		});
		
		it("should respond to query params and return the 3 latest news", (done)=>{

			Promise.all([
				saveAPiece({title: "first"}),
				saveAPiece({title: "second"}),
				saveAPiece({title: "third"})
			])
			.then(()=> {
				return saveAPiece({title: "fourth"})
			})
			.then(()=> {
				return saveAPiece({title: "fifth"})
			})
			.then(()=> {
				return saveAPiece({title: "sixth"})
			})
			.then(resp=>{
				chai.request(server)
				.get('/api/news?last=3')
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
				saveAPiece({title: "first"}),
				saveAPiece({title: "second"})
			])
				.then(()=> {
					return saveAPiece({title: "third"})
				})
				.then(()=> {
					return saveAPiece({title: "fourth"})
				})
				.then(()=> {
					return saveAPiece({title: "fifth"})
				})
				.then(()=> {
					return saveAPiece({title: "sixth"})
				})
				.then(resp=>{
					chai.request(server)
						.get('/api/news?last=4')
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


		it('it should get a single piece of news', (done) => {

			let newNews = new News.model({
				title: 'New News',
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
				.get(`/api/news/id/${id}`)
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.be.an("object");
					res.body.should.have.property("news");
					res.body.news.should.be.an("object");
					res.body.news.should.have.property("title");
					res.body.news.should.have.property("_id");
					res.body.news._id.should.be.eql(id.toString());
					done();
				});	
			})
	
		});
	})




	describe("it should export a 'getBySlug' function", ()=>{
	
		beforeEach(cleanNews);
	
		it('should export a "getBySlug" function', () => {
			expect(News.getBySlug).to.be.a("Function")
		});
		
		it('it should get a single piece of news', (done) => {

			let newNews = new News.model({
				title: 'New News',
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
				.get(`/api/news/${slug}`)
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

		});

		// it('it should contain an image link', (done) => {
		//
		// 		let newNews = new News.model({
		// 			title: 'New News',
		// 			// featuredImage: "http://res.cloudinary.com/dsgc8mdss/image/upload/v1478026701/dbc0j46lgrewxerwio8o.jpg"
		// 		});
		//	
		// 		new Promise((resolve, reject)=>{
		// 			newNews.save(function(err, post) {
		// 				if(err) reject(err);
		// 				const slug = post.slug;
		// 				resolve(slug);
		// 			});
		// 		})
		// 		.then(slug=>{
		// 			chai.request(server)
		// 			.get(`/api/news/${slug}`)
		// 			.end((err, res) => {
		// 			res.should.have.status(200);
		// 			res.body.news.length.should.be.eql(1);
		//			
		// 			let pieceOfNews = res.body.news[0];
		// 			pieceOfNews.should.have.property("featuredImage");
		// 			pieceOfNews.featuredImage.should.be.eql("http://res.cloudinary.com/dsgc8mdss/image/upload/v1478026701/dbc0j46lgrewxerwio8o.jpg");
		//			
		// 			done();
		// 		});
		// 	})
		// });
		//
		
	})
});

// TODO IMAGES

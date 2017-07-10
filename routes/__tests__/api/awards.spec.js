'use strict';

const keystone = require("../../../keystone");
const server = keystone.app;
const Awards = keystone.list('Awards');
const chai = require("chai");
const expect = chai.expect;
const should = chai.should();
const chaiHttp = require('chai-http');
const Abstract = require("../../api/abstract");

const saveAward = require("./test-utils").saveOne(Awards.model);
const clearAwards = require("./test-utils").clearItems(Awards.model);

chai.use(chaiHttp);


describe("testing awards", ()=>{
	
	describe("Awards list model", ()=>{
		it("it should map by 'title.en'", ()=>{
			expect(Awards.options.map.name).to.be.eql('title.en');
		});

		it("it should autokey by slug and 'title.en'", ()=>{
			expect(Awards.options.autokey.path).to.be.eql('slug');
			expect(Awards.options.autokey.from).to.be.eql('title.en');
		});
	});
	
	
	
	describe("list function", ()=>{
		
		beforeEach(clearAwards);
		after(clearAwards);
		
		it('it should GET all the awards(0)', (done) => {
			chai.request(server)
				.get('/api/en/model/awards')
				.end((err, res) => {

					res.should.have.status(200);
					expect(res.body).to.be.an('object');
					expect(res.body).to.have.property('items');
					expect(res.body.items).to.be.a('array');
					expect(res.body.items.length).to.be.eql(0);
					done();
				});
		});

		it('it should GET all the awards(1)', (done) => {
			
			saveAward({
				title: {
					en: "English title for award",
					bg: "Bulgarian title for award"
				}
			})
			.then(()=>{
				chai.request(server)
					.get('/api/en/model/awards')
					.end((err, res) => {
						res.should.have.status(200);
						expect(res.body.items.length).to.be.eql(1);
						done();
					});
			})
		}); // end of test

		it('it should GET all the awards(3)', (done) => {

			saveAward({
				title: {
					en: "English title for award1",
					bg: "Bulgarian title for award1"
				}
			}).then(()=>saveAward({
				title: {
					en: "English title for award2",
					bg: "Bulgarian title for award2"
				}
			}))
			.then(()=>saveAward({
				title: {
					en: "English title for award3",
					bg: "Bulgarian title for award3"
				}
			}))
				.then(()=>{
					chai.request(server)
						.get('/api/en/model/awards')
						.end((err, res) => {
							res.should.have.status(200);
							expect(res.body.items.length).to.be.eql(3);
							done();
						});
				})
		}); // end of test

		it('it should GET all the awards(3) BG version', (done) => {

			saveAward({
				title: {
					en: "English title for award1",
					bg: "Bulgarian title for award1"
				}
			}).then(()=>saveAward({
				title: {
					en: "English title for award2",
					bg: "Bulgarian title for award2"
				}
			}))
				.then(()=>saveAward({
					title: {
						en: "English title for award3",
						bg: "Bulgarian title for award3"
					}
				}))
				.then(()=>{
					chai.request(server)
						.get('/api/bg/model/awards')
						.end((err, res) => {
							res.should.have.status(200);
							expect(res.body.items.length).to.be.eql(3);
							done();
						});
				})
		}); // end of test

		it('it should GET all the awards(3) BG version - and have the correct language version title', (done) => {

			saveAward({
				title: {
					en: "English title for award1",
					bg: "Bulgarian title for award1"
				}
			}).then(()=>saveAward({
				title: {
					en: "English title for award2",
					bg: "Bulgarian title for award2"
				}
			}))
				.then(()=>saveAward({
					title: {
						en: "English title for award3",
						bg: "Bulgarian title for award3"
					}
				}))
				.then(()=>{
					chai.request(server)
						.get('/api/bg/model/awards')
						.end((err, res) => {
							res.should.have.status(200);
							expect(res.body.items[0].title).to.be.eql("Bulgarian title for award1");
							expect(res.body.items[1].title).to.be.eql("Bulgarian title for award2");
							expect(res.body.items[2].title).to.be.eql("Bulgarian title for award3");
							done();
						});
				})
		}); // end of test

		it('it should GET all the awards(3) and the appropriate translation - EN', (done) => {

			saveAward({
				title: {
					en: "English title for award1",
					bg: "Bulgarian title for award1"
				},
				content: {
					en: "Some english content1",
					bg: "Some bulgarian content1"
				}
			}).then(()=>saveAward({
				title: {
					en: "English title for award2",
					bg: "Bulgarian title for award2"
				},
				content: {
					en: "Some english content2",
					bg: "Some bulgarian content2"
				}
			}))
				.then(()=>saveAward({
					title: {
						en: "English title for award3",
						bg: "Bulgarian title for award3"
					},
					content: {
						en: "Some english content3",
						bg: "Some bulgarian content3"
					}
				}))
				.then(()=>{
					chai.request(server)
						.get('/api/en/model/awards')
						.end((err, res) => {
							res.should.have.status(200);
							expect(res.body.items[0].title).to.be.eql("English title for award1");
							expect(res.body.items[0].content).to.be.eql("Some english content1");
							expect(res.body.items[1].title).to.be.eql("English title for award2");
							expect(res.body.items[1].content).to.be.eql("Some english content2");
							expect(res.body.items[2].title).to.be.eql("English title for award3");
							expect(res.body.items[2].content).to.be.eql("Some english content3");
							done();
						});
				})
		}); // end of test
			
	}); // end of describe for List

	describe("get by slug function", ()=>{

		beforeEach(clearAwards);
		after(clearAwards);

		it('it should GET the correct item by slug(1) EN', (done) => {

			saveAward({
				title: {
					en: "English title for award1",
					bg: "Bulgarian title for award1"
				},
				content: {
					en: "Some english content1",
					bg: "Some bulgarian content1"
				}
			}).then(()=>saveAward({
				title: {
					en: "English title for award2",
					bg: "Bulgarian title for award2"
				},
				content: {
					en: "Some english content2",
					bg: "Some bulgarian content2"
				}
			}))
				.then(()=>saveAward({
					title: {
						en: "English title for award3",
						bg: "Bulgarian title for award3"
					},
					content: {
						en: "Some english content3",
						bg: "Some bulgarian content3"
					}
				}))
				.then(()=>{
					chai.request(server)
						.get('/api/en/model/awards/english-title-for-award1')
						.end((err, res) => {
							res.should.have.status(200);
							expect(res.body.items).to.be.a('Array');
							expect(res.body.items.length).to.be.eql(1);
							expect(res.body.items[0].title).to.be.eql("English title for award1");
							expect(res.body.items[0].content).to.be.eql("Some english content1");
							done();
						});
				})
		}); // end of test

		it('it should GET the correct item by slug(1) BG', (done) => {

			saveAward({
				title: {
					en: "English title for award1",
					bg: "Bulgarian title for award1"
				},
				content: {
					en: "Some english content1",
					bg: "Some bulgarian content1"
				}
			}).then(()=>saveAward({
				title: {
					en: "English title for award2",
					bg: "Bulgarian title for award2"
				},
				content: {
					en: "Some english content2",
					bg: "Some bulgarian content2"
				}
			}))
				.then(()=>saveAward({
					title: {
						en: "English title for award3",
						bg: "Bulgarian title for award3"
					},
					content: {
						en: "Some english content3",
						bg: "Some bulgarian content3"
					}
				}))
				.then(()=>{
					chai.request(server)
						.get('/api/bg/model/awards/english-title-for-award1')
						.end((err, res) => {
							res.should.have.status(200);
							expect(res.body.items).to.be.a('Array');
							expect(res.body.items.length).to.be.eql(1);
							expect(res.body.items[0].title).to.be.eql("Bulgarian title for award1");
							expect(res.body.items[0].content).to.be.eql("Some bulgarian content1");
							done();
						});
				})
		}); // end of test

		it('it should GET the correct item by slug(2) EN', (done) => {

			saveAward({
				title: {
					en: "English title for award1",
					bg: "Bulgarian title for award1"
				},
				content: {
					en: "Some english content1",
					bg: "Some bulgarian content1"
				}
			}).then(()=>saveAward({
				title: {
					en: "English title for award2",
					bg: "Bulgarian title for award2"
				},
				content: {
					en: "Some english content2",
					bg: "Some bulgarian content2"
				}
			}))
				.then(()=>saveAward({
					title: {
						en: "English title for award3",
						bg: "Bulgarian title for award3"
					},
					content: {
						en: "Some english content3",
						bg: "Some bulgarian content3"
					}
				}))
				.then(()=>{
					chai.request(server)
						.get('/api/en/model/awards/english-title-for-award2')
						.end((err, res) => {
							res.should.have.status(200);
							expect(res.body.items).to.be.a('Array');
							expect(res.body.items.length).to.be.eql(1);
							expect(res.body.items[0].title).to.be.eql("English title for award2");
							expect(res.body.items[0].content).to.be.eql("Some english content2");
							done();
						});
				})
		}); // end of test


		it('it should GET the correct item by slug(2) BG', (done) => {

			saveAward({
				title: {
					en: "English title for award1",
					bg: "Bulgarian title for award1"
				},
				content: {
					en: "Some english content1",
					bg: "Some bulgarian content1"
				}
			}).then(()=>saveAward({
				title: {
					en: "English title for award2",
					bg: "Bulgarian title for award2"
				},
				content: {
					en: "Some english content2",
					bg: "Some bulgarian content2"
				}
			}))
				.then(()=>saveAward({
					title: {
						en: "English title for award3",
						bg: "Bulgarian title for award3"
					},
					content: {
						en: "Some english content3",
						bg: "Some bulgarian content3"
					}
				}))
				.then(()=>{
					chai.request(server)
						.get('/api/bg/model/awards/english-title-for-award2')
						.end((err, res) => {
							res.should.have.status(200);
							expect(res.body.items).to.be.a('Array');
							expect(res.body.items.length).to.be.eql(1);
							expect(res.body.items[0].title).to.be.eql("Bulgarian title for award2");
							expect(res.body.items[0].content).to.be.eql("Some bulgarian content2");
							done();
						});
				})
		}); // end of test

	}); // end of describe for getBySug


	describe("get by ID function", ()=>{

		beforeEach(clearAwards);
		after(clearAwards);

		it('it should GET the correct item by id(1) BG', (done) => {

			saveAward({
				title: {
					en: "English title for award1",
					bg: "Bulgarian title for award1"
				},
				content: {
					en: "Some english content1",
					bg: "Some bulgarian content1"
				}
			}).then(()=>saveAward({
				title: {
					en: "English title for award2",
					bg: "Bulgarian title for award2"
				},
				content: {
					en: "Some english content2",
					bg: "Some bulgarian content2"
				}
			}))
				.then(()=>saveAward({
					title: {
						en: "English title for award3",
						bg: "Bulgarian title for award3"
					},
					content: {
						en: "Some english content3",
						bg: "Some bulgarian content3"
					}
				}))
				.then((award)=>{
					let lastAwardId = award._id;
					chai.request(server)
						.get('/api/bg/model/awards/id/' + lastAwardId)
						.end((err, res) => {
							res.should.have.status(200);
							expect(res.body.items).to.be.a('Array');
							expect(res.body.items.length).to.be.eql(1);
							expect(res.body.items[0].title).to.be.eql("Bulgarian title for award3");
							expect(res.body.items[0].content).to.be.eql("Some bulgarian content3");
							done();
						});
				})
		}); // end of test

		it('it should GET the correct item by id(1) BG - async', (done) => {

			Promise.all([
				saveAward({
					title: {
						en: "English title for award1",
						bg: "Bulgarian title for award1"
					},
					content: {
						en: "Some english content1",
						bg: "Some bulgarian content1"
					}
				}),
				saveAward({
					title: {
						en: "English title for award2",
						bg: "Bulgarian title for award2"
					},
					content: {
						en: "Some english content2",
						bg: "Some bulgarian content2"
					}
				}),
				saveAward({
					title: {
						en: "English title for award3",
						bg: "Bulgarian title for award3"
					},
					content: {
						en: "Some english content3",
						bg: "Some bulgarian content3"
					}
				})
			])
				
			.then((awards)=>{
				
				chai.request(server)
					.get('/api/bg/model/awards/id/' + awards[0]._id)
					.end((err, res) => {
						res.should.have.status(200);
						expect(res.body.items).to.be.a('Array');
						expect(res.body.items.length).to.be.eql(1);
						expect(res.body.items[0].title).to.be.eql("Bulgarian title for award1");
						expect(res.body.items[0].content).to.be.eql("Some bulgarian content1");
						done();
					});
			})
		}); // end of test

		it('it should GET the correct item by id(2) BG', (done) => {

			Promise.all([
				saveAward({
					title: {
						en: "English title for award1",
						bg: "Bulgarian title for award1"
					},
					content: {
						en: "Some english content1",
						bg: "Some bulgarian content1"
					}
				}),
				saveAward({
					title: {
						en: "English title for award2",
						bg: "Bulgarian title for award2"
					},
					content: {
						en: "Some english content2",
						bg: "Some bulgarian content2"
					}
				}),
				saveAward({
					title: {
						en: "English title for award3",
						bg: "Bulgarian title for award3"
					},
					content: {
						en: "Some english content3",
						bg: "Some bulgarian content3"
					}
				})
			])

				.then((awards)=>{

					chai.request(server)
						.get('/api/bg/model/awards/id/' + awards[1]._id)
						.end((err, res) => {
							res.should.have.status(200);
							expect(res.body.items).to.be.a('Array');
							expect(res.body.items.length).to.be.eql(1);
							expect(res.body.items[0].title).to.be.eql("Bulgarian title for award2");
							expect(res.body.items[0].content).to.be.eql("Some bulgarian content2");
							done();
						});
				})
		}); // end of test


		it('it should GET the correct item by id(3) BG', (done) => {

			Promise.all([
				saveAward({
					title: {
						en: "English title for award1",
						bg: "Bulgarian title for award1"
					},
					content: {
						en: "Some english content1",
						bg: "Some bulgarian content1"
					}
				}),
				saveAward({
					title: {
						en: "English title for award2",
						bg: "Bulgarian title for award2"
					},
					content: {
						en: "Some english content2",
						bg: "Some bulgarian content2"
					}
				}),
				saveAward({
					title: {
						en: "English title for award3",
						bg: "Bulgarian title for award3"
					},
					content: {
						en: "Some english content3",
						bg: "Some bulgarian content3"
					}
				})
			])

				.then((awards)=>{

					chai.request(server)
						.get('/api/bg/model/awards/id/' + awards[2]._id)
						.end((err, res) => {
							res.should.have.status(200);
							expect(res.body.items).to.be.a('Array');
							expect(res.body.items.length).to.be.eql(1);
							expect(res.body.items[0].title).to.be.eql("Bulgarian title for award3");
							expect(res.body.items[0].content).to.be.eql("Some bulgarian content3");
							done();
						});
				})
		}); // end of test
		
		
	}); // end of describe for getById

}); // end of describe

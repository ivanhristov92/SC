// @flow
'use strict';
const _ 		  = require("ramda");
const getPreferredLanguageVersionForModel = require("./common").getPreferredLanguageVersionForModel;
const sendAPIResponse = require("./common").sendAPIResponse;
const extractModelType = require("./common").extractModelType;
const Future 		   = require("ramda-fantasy").Future;


const extractSlug = req => _.always( req.params.slug );


const _getBySlug = req => slug => {

	let MaybeAbstractModel = extractModelType(req);

	return MaybeAbstractModel.chain(AbstractMode=>{
		return Future((reject, resolve) => {
			AbstractModel.find({slug})
			/**
			 *  @param news: Array<PieceOfNews>
			 */
				.exec((err, news) => {
					if (err) reject(err)
					resolve(news);
				});
		});
	})
}

exports.getBySlug = ( req, res ) => 
	_.compose(
		_.map(sendAPIResponse(res)),
		_.map(getPreferredLanguageVersionForModel(req)),
		_getBySlug(req),
		extractSlug(req)
	)();
	


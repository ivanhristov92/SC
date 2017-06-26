/**
 * Created by Game Station on 27.6.2017 г..
 */
const _ = require ("ramda");

exports.language = {
	isEnglish: req => _.equals(req.params.language, "en"),
	isBulgarian: req => _.equals(req.params.language, "bg")
};

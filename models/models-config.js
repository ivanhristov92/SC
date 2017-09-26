/**
 * Created by Game Station on 27.9.2017 г..
 */

const model = (path, urlEquivalent) => Object.assign({}, {
	internalName: String(Math.pow(Math.random(), Math.random())),
	path,
	urlEquivalent
});

exports.models = [
	model(__dirname + "/News", "news"),
	model(__dirname + "/Awards", "awards"),
	model(__dirname + "/Productions", "productions"),
	model(__dirname + "/Services", "services"),
	model(__dirname + "/Prizes", "prizes"),
];

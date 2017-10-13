/**
 * Created by Game Station on 12.10.2017 г..
 */
const _ = require("ramda");
const config = require("../../.pm.config").config;
const fromArgs = require("./common").fromArgs;
const {fName, cName} = require("./templates");

exports.fName = fName;
exports.cName = cName;

const argsName = () => fromArgs("name", "Default Module Name Value");

const capitalize = (word)=> {
	return word.split("")
		.reduce((acc, curr, i)=> {
			return acc + ((i === 0) ? curr.toUpperCase() : curr.toLowerCase())
		}, "")
};

const namingStrategies = {
	pascalCase: str => str.split(" ").map(capitalize).join(""),
	kebabCase: str => str.split(" ").map(_.toLower).join("-")
};

exports.moduleName = _.compose(
	namingStrategies.pascalCase
	, argsName
);

exports.moduleFolderName = (strategy) =>_.compose(
	 (strategy === "pascalCase") ? namingStrategies.pascalCase : namingStrategies.kebabCase
	, argsName
)();

exports.fileName = _.compose(
	str =>
		str.split(" ")
		// remove white spaces
			.filter(el => el !== " ")
			.join("-")

	, _.toLower
	, argsName
);

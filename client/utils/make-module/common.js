/**
 * Created by Game Station on 12.10.2017 г..
 */
const fs = require('fs');
const path = require('path');
const _ = require("ramda");


exports.fromArgs = (flagName, defaultValue) => {

	let _flag = `--${flagName}`;

	let param = process.argv.filter(arg=>arg.match(new RegExp(_flag,"g")));
	return _.isEmpty(param)
		? defaultValue
		: _.compose(
			str=>str.replace(`--${flagName}=`, "")
			, _.head
		)(param)
};

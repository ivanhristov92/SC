const path = require("path");
const root = __dirname;

const config = {
	root: __dirname,
	modules: path.join("app", "modules"),
	rootEpic: path.join("app", "redux-resources", "root-epic.js"),
	rootReducer: path.join("app", "redux-resources", "root-reducer.js")
};

exports.config = config;


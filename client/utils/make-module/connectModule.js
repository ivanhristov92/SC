/**
 * Created by Game Station on 12.10.2017 г..
 */
const fs = require('fs');
const path = require('path');
const _ = require("ramda");
const toRoot = path.join("..", "..");
const config = require(path.join(toRoot, ".pm.config")).config;
const fromArgs = require("./common").fromArgs;
const {moduleName, moduleFolderName, fileName, cName, fName} = require("./naming");

let modFoldName = moduleFolderName();
let modName = moduleName();
if(!modFoldName){throw new Error("Module Name is required")}


let modEpicsPath =path.join(toRoot, config.modules, modFoldName, fName.epics(modFoldName));
let modEpicsConst = cName.epics(modName);

// // // // Epics
let rEpFile = fs.readFileSync(config.rootEpic, "utf8");
let split = rEpFile.split(/\/\/pm imports/)
split.splice(1, 0, `\n//pm imports\nimport ${modEpicsConst} from "./${modEpicsPath}"\n`);
let withImports = split.join(" ");


let split2 = withImports.split(/\/\/pm exports/);
split2.splice(1, 0, `\n//pm exports\n...${modEpicsConst},\n`);
let withExports = split2.join(" ");


let rootEpicPath = config.rootEpic;
fs.writeFileSync(rootEpicPath, withExports);
// // // // 


// // // // Reducer
{
	let modReducerConst = cName.reducer(modName);
	let modReducerPath = path.join(toRoot, config.modules, modFoldName, fName.reducer(modFoldName));

	let rRedFile = fs.readFileSync(config.rootReducer, "utf8");
	let split = rRedFile.split(/\/\/pm imports/);
	split.splice(1, 0, `\n//pm imports\nimport ${modReducerConst} from "./${modReducerPath}"\n`);
	let withImports = split.join(" ");


	let split2 = withImports.split(/\/\/pm exports/);
	split2.splice(1, 0, `\n//pm exports\nsubState: ${modReducerConst},\n`);
	let withExports = split2.join(" ");
	
	let rootReducerPath = config.rootReducer;
	fs.writeFileSync(rootReducerPath, withExports);
}



// // // // 

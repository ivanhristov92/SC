/**
 * Created by Game Station on 12.10.2017 г..
 */
const fs = require('fs');
const path = require('path');
const _ = require("ramda");
const toRoot = path.join("..", "..");
const config = require(path.join(toRoot, ".pm.config")).config;
let foldNamingStrat = config.naming ? config.naming.moduleFolder : null;

const fromArgs = require("./common").fromArgs;
const {moduleName, moduleFolderName, fileName, cName, fName} = require("./naming");

let modFoldName = moduleFolderName(foldNamingStrat);
let modName = moduleName();
if(!modFoldName){throw new Error("Module Name is required")}



// // // // Epics
{

    let modEpicsPath =path.join(toRoot, config.modules, modFoldName, "exports");
    let modEpicsConst = cName.epics(modName);

    let rEpFile = fs.readFileSync(config.rootEpic, "utf8");
    let split = rEpFile.split(/\/\/pm imports/)
    split.splice(1, 0, `\n//pm imports\nimport {${modEpicsConst}} from "./${modEpicsPath}"\n`);
    let withImports = split.join(" ");


    let split2 = withImports.split(/\/\/pm exports/);
    split2.splice(1, 0, `\n//pm exports\n...${modEpicsConst},\n`);
    let withExports = split2.join(" ");


    let rootEpicPath = config.rootEpic;
	fs.writeFileSync(rootEpicPath, withExports);
}
// // // // 


// // // // Reducer
{
	let subStateName = fromArgs("subState", "subState");
	let modReducerConst = cName.reducer(modName);
	let modReducerPath = path.join(toRoot, config.modules, modFoldName, "exports");

	let rRedFile = fs.readFileSync(config.rootReducer, "utf8");
	let split = rRedFile.split(/\/\/pm imports/);
	split.splice(1, 0, `\n//pm imports\nimport {${modReducerConst}} from "./${modReducerPath}"\n`);
	let withImports = split.join(" ");


	let split2 = withImports.split(/\/\/pm exports/);

	split2.splice(1, 0, `\n//pm exports\n${subStateName}: ${modReducerConst},\n`);
	let withExports = split2.join(" ");
	console.log(withExports)
	let rootReducerPath = config.rootReducer;
	fs.writeFileSync(rootReducerPath, withExports);
}



// // // // 

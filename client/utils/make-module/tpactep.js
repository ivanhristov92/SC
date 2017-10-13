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


if(!fromArgs("name", null)){throw new Error("Module Name is required")}
if(!fromArgs("epic", null)){throw new Error("Epic Name is required")}



// // // // Epics
{

    let modEpicsPath = path.join(config.root, config.modules, modFoldName, fName.epics(fileName()) + ".js");
    let modEpicsConst = cName.epics(modName);

    console.log(modEpicsPath);

    let modEpFile = fs.readFileSync(modEpicsPath, "utf8");
    let split = modEpFile.split(/\/\/pm epics/)
    split.splice(1, 0, `\n//pm epics\ntest test test\n`);
    let withImports = split.join(" ");



    let split2 = withImports.split(/\/\/pm exports/);
    split2.splice(1, 0, `\n//pm exports\ntest test test,\n`);
    let withExports = split2.join(" ");


    let rootEpicPath = config.rootEpic;
    fs.writeFileSync(modEpicsPath + ".BAK.js", withExports);
}
// // // //

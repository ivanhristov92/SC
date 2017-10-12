/**
 * Created by qfintern on 10/11/17.
 */
const fs = require('fs');
const path = require('path');
const _ = require("ramda");

const templates = require("./templates").actions;
const fromArgs = require("./common").fromArgs;


const argsName = () => fromArgs("name", "Default Module Name Value");
const modulePath = () => fromArgs("path", "/");


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

const moduleName = _.compose(
	namingStrategies.pascalCase
    , argsName
);

const moduleFolderName = _.compose(
	namingStrategies.kebabCase
	, argsName
);

const fileName = _.compose(
    str => 
		str.split(" ")
        // remove white spaces
        .filter(el => el !== " ")
        .join("-")
	
    , _.toLower
    , argsName
);

const createModuleFolder = () => {
    let modName = moduleName();
    let modFoldName = moduleFolderName();
    let modPath = path.join(__dirname, modulePath(), modFoldName);

    try{
        fs.mkdirSync(modPath);
        console.log("dir created at " + modPath)
    } catch(err){
        console.log(err)
    }
    return {modPath, modFoldName, modName};
};

const createModuleFiles = ({modPath, modFoldName, modName})=>{
    let _fName = fileName();

    [
        "actions",
        "action-types",
        "reducer",
        "epics",
        "selectors",
        "exports"
    ]
    .forEach(type => {

        let fName = (type === "exports") ? `${modPath}/exports.js` : `${modPath}/${type}-${_fName}.js`;
        fs.writeFileSync(fName, require("./templates")[type]({moduleName: modName, fileName: _fName, modFoldName}));
        console.log(`${fName} saved!`);
    })
};


_.pipe(
    createModuleFolder,
    createModuleFiles
)();

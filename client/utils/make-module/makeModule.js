/**
 * Created by qfintern on 10/11/17.
 */
const fs = require('fs');
const path = require('path');
const _ = require("ramda");
const config = require("../../.pm.config").config;
const templates = require("./templates").actions;
const {moduleName, moduleFolderName, fileName} = require("./naming");


const modulePath = () => path.join(config.root , config.modules);

const createModuleFolder = () => {
    let modName = moduleName();
    let modFoldName = moduleFolderName();
    let modPath = path.join(modulePath(), modFoldName);

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

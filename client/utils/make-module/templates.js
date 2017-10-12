/**
 * Created by qfintern on 10/11/17.
 */
const cName = {
	actions: (moduleName) => `${moduleName}Actions`,
	actionTypes: (moduleName) => `${moduleName}ActionTypes`,
	selectors: (moduleName) => `${moduleName}Selectors`,
	epics: (moduleName) => `${moduleName}Epics`,
	reducer: (moduleName) => `${moduleName}Reducer`,
};
const fName = {
	actions: (fileName) => `actions-${fileName}`,
	actionTypes: (fileName) => `action-types-${fileName}`,
	selectors: (fileName) => `selectors-${fileName}`,
	epics: (fileName) => `epics-${fileName}`,
	reducer: (fileName) => `reducer-${fileName}`,

};

module.exports.actions = ({moduleName, fileName}) =>`
import ${cName.actionTypes(moduleName)} from "./${fName.actionTypes(fileName)}";

const action = () =>({
   type: ${cName.actionTypes(moduleName)}.SAMPLE_TYPE
});

export default Object.freeze({
    action
})
`;


module.exports["action-types"] = ({moduleName, fileName}) =>`
export default Object.freeze({
    SAMPLE_TYPE: "SAMPLE_TYPE"
})
`;

module.exports.reducer = ({moduleName, fileName}) => `
import ${cName.actionTypes(moduleName)} from "./${fName.actionTypes(fileName)}";

export default function ${moduleName}Reducer(state = {}, action){
    switch(action.type){
    
        case ${cName.actionTypes(moduleName)}.SAMPLE_TYPE:
            return {
                ...state
            }
    
        default: 
            return state;
    }
}

export const ${cName.selectors(moduleName)} = {
    getState: state => state
}
`;

module.exports.epics = ({moduleName, fileName}) => `
import { Observable } from 'rxjs';
import ${cName.actionTypes(moduleName)} from "./${fName.actionTypes(fileName)}";

const sampleEpic = action$ =>
  action$
    .ofType(${cName.actionTypes(moduleName)}.SAMPLE_TYPE)
    .debounceTime(200)
    .flatMap(() => Observable.of({type: "success"}));
    
    
export default [
    sampleEpic
]
`;

module.exports.selectors = ({moduleName, fileName}) =>`
import {${cName.selectors(moduleName)}} from "./${fName.reducer(fileName)}";

export default Object.freeze({
    getState: state => ${cName.selectors(moduleName)}.getState(state)
});
`;

module.exports["exports"] = ({moduleName, fileName}) =>`
import ${cName.actionTypes(moduleName)} from "./${fName.actionTypes(fileName)}";
import ${cName.actions(moduleName)} from "./${fName.actions(fileName)}";
import ${cName.reducer(moduleName)} from "./${fName.reducer(fileName)}";
import ${cName.selectors(moduleName)} from "./${fName.selectors(fileName)}";
import ${cName.epics(moduleName)} from "./${fName.epics(fileName)}";

export {
    ${cName.actionTypes(moduleName)},
    ${cName.actions(moduleName)},
    ${cName.reducer(moduleName)},
    ${cName.selectors(moduleName)},
    ${cName.epics(moduleName)}
}
`;

/**
 * Created by Game Station on 20.9.2017 г..
 */
import { combineEpics } from 'redux-observable';
 
//pm imports
import TestModuleEpics from "./..\..\app\modules\test-module\epics-test-module"
 
import SampleEpics from "../modules/sample/epics-sample";


export default combineEpics(
 
//pm exports
...TestModuleEpics,
 
	...SampleEpics
);

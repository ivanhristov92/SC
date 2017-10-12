/**
 * Created by Game Station on 20.9.2017 г..
 */
import { combineReducers } from 'redux';

 
//pm imports
import TestModuleReducer from "./..\..\app\modules\test-module\reducer-test-module"
 
import SampleReducer from "../modules/sample/reducer-sample";

export default combineReducers({
	 
//pm exports
subState: TestModuleReducer,
 
	sample: SampleReducer
});

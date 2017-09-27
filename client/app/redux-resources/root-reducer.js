/**
 * Created by Game Station on 20.9.2017 г..
 */
import { combineReducers } from 'redux';
import SampleReducer from "../modules/sample/reducer-sample";

export default combineReducers({
	sample: SampleReducer
});

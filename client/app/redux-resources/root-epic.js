/**
 * Created by Game Station on 20.9.2017 г..
 */
import { combineEpics } from 'redux-observable';
import SampleEpics from "../modules/sample/epics-sample";

export default combineEpics(
	...SampleEpics
);

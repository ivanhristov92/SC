/**
 * Created by Game Station on 27.9.2017 г..
 */
import {Observable} from "rxjs";

const sampleEpic = (action$)=>{
	return action$.ofType()	
		.mapTo({type: "TEST"})
};

export default [
	sampleEpic
]

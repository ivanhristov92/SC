/**
 * Created by Game Station on 27.9.2017 г..
 */
import * as SampleActionTypes from "./action-types-sample";

export default function(state = {
	sample: {
		value: true
	}
}, action){
	switch(action.type){
		
		case SampleActionTypes.SAMPLE:
			return {
				...state
			};
			
		default:
			return state;
	}
}

export const SampleSelectors = {
	getSample: (state)=>{
		return state.sample.value
	}
};

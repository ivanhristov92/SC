/**
 * Created by Game Station on 27.9.2017 г..
 */
import  SampleSelectors from "./reducer-sample";

export default {
	getSample: state => SampleSelectors.getSample(state.sample)
}

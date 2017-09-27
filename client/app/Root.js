/**
 * Created by Game Station on 27.9.2017 г..
 */
import PropTypes from 'prop-types';
import React from 'react';
import { Provider } from 'react-redux';
import { Route } from 'react-router-dom';
import { ConnectedRouter } from 'react-router-redux';


const App = ()=>(<div>App</div>)

export default function Root({store, history}) {
	return (
		<Provider store={store}>
			<div>
				<ConnectedRouter history={history}>
					<Route path="/" component={App}/>
				</ConnectedRouter>
			</div>
		</Provider>
	);
}

Root.propTypes = {
	store: PropTypes.object.isRequired,
	history: PropTypes.object.isRequired
};

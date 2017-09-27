import createHistory from 'history/createBrowserHistory';
import { applyMiddleware, createStore, compose } from 'redux';
import { routerMiddleware } from 'react-router-redux';
import { createEpicMiddleware } from 'redux-observable';

import rootReducer from '../root-reducer';
import rootEpic from '../root-epic';

export const history = createHistory();


export function configureStore(initialState) {


    const composeEnhancers =
        typeof window === 'object' &&
        window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ?
            window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
            }) : compose;


    const enhancer = composeEnhancers(
        applyMiddleware(
			createEpicMiddleware(rootEpic),
			routerMiddleware(history)
        )
    );


    return createStore(
        rootReducer,
        initialState,
        enhancer
    );
}


import logger from 'redux-logger';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import { createStore, applyMiddleware } from 'redux';

import rootReducer from './reducers';

//const store = createStore(rootReducer, composeWithDevTools(applyMiddleware(logger, thunk)));
const store = createStore(rootReducer, composeWithDevTools());

export default store;

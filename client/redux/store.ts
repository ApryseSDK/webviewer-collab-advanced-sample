import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import logger from 'redux-logger';

import { reducer as UserReducer } from './user';
import { reducer as DocumentsReducer } from './documents';
import { reducer as ViewerReducer } from './viewer';

const rootReducer = combineReducers({
  user: UserReducer,
  documents: DocumentsReducer,
  viewer: ViewerReducer,
});

export default createStore(rootReducer, applyMiddleware(thunk, logger));

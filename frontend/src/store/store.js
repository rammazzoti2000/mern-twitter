import { createStore, appyMiddleWare } from 'redux';
import thunk from 'redux-thunk';
import logger from 'redux-logger';

import rootReducer from '../reducers/root_reducer';

const configureStore = (preloadState = {}) => {
  createStore(
    rootReducer,
    preloadState,
    appyMiddleWare(thunk, logger)
  )
};

export default configureStore;

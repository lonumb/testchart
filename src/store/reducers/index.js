import { combineReducers } from 'redux';

import user from './User';
import common from './Common';

const rootReducer = combineReducers({
  common,
  user,
});

export default rootReducer;

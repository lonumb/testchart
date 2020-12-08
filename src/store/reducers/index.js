import { combineReducers } from 'redux';

import common from './Common';
import user from './User';
import trade from './Trade';
import contract from './Contract';

const rootReducer = combineReducers({
  common,
  user,
  trade,
  contract,
});

export default rootReducer;

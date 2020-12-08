import * as Types from '../types';

const defaultState = {
  poolList: [],
};

const walletReducer = (state = defaultState, action) => {
  let nextState = {};
  let params = action.payload;
  switch (action.type) {
    case Types.POOL_LIST:
      nextState = { ...state, poolList: params || [] };
      break;

    default:
      nextState = { ...state };
      break;
  }
  return nextState;
};

export default walletReducer;

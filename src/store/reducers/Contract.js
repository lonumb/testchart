import * as Types from '../types';

const defaultState = {
  poolList: [],
  poolInfo: {},
};

const walletReducer = (state = defaultState, action) => {
  let nextState = {};
  let data = action.payload;
  switch (action.type) {
    case Types.POOL_LIST:
      nextState = { ...state, poolList: data || [] };
      break;

    case Types.POOL_INFO:
      nextState = { ...state, poolInfo: data || {} };
      break;

    default:
      nextState = { ...state };
      break;
  }
  return nextState;
};

export default walletReducer;

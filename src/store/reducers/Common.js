import * as Types from '../types';

const defaultState = {
  withdraw: { visible: false, code: '' },
  recharge: { visible: false, code: '' },
  wallet: { visible: false },
};

const common = (state = defaultState, action) => {
  let nextState = {};
  let params = action.payload;
  switch (action.type) {
    case Types.RECHARGE_VISIBLE:
      nextState = { ...state, recharge: { visible: params.visible, code: params.code || '' } };
      break;

    case Types.WITHDRAW_VISIBLE:
      nextState = { ...state, withdraw: { visible: params.visible, code: params.code || '' } };
      break;

    case Types.WALLET_VISIBLE:
      nextState = { ...state, wallet: { ...state.wallet, visible: params.visible } };
      break;

    default:
      nextState = { ...state };
      break;
  }
  return nextState;
};

export default common;

import { createAction } from 'redux-actions';
import * as Types from '../types';

/**
 * 充值modal控制
 * @param {*} params
 */
export const actionRechargeModal = (params) => {
  const { visible, code = '' } = params;
  return (dispatch) => {
    dispatch(createAction(Types.RECHARGE_VISIBLE)({ visible, code }));
  };
};

/**
 * 提现modal控制
 * @param {*} params
 */
export const actionWithdrawModal = (params) => {
  const { visible, code = '' } = params;
  return (dispatch) => {
    dispatch(createAction(Types.WITHDRAW_VISIBLE)({ visible, code }));
  };
};

/** 钱包modal控制
 * @param {*} params
 */
export const actionWalletModal = (params) => {
  return (dispatch) => {
    dispatch(createAction(Types.WALLET_VISIBLE)({ visible: params }));
  };
};

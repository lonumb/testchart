import { createAction } from 'redux-actions';
import * as Types from '../types';

/**
 * 充值modal控制
 * @param {*} params
 */
export const actionPoolList = (params) => {
  const { data } = params;
  return (dispatch) => {
    let temp = [];
    if (data.allSymbol && data.allSymbol.length) {
      data.allSymbol.forEach((element, index) => {
        console.log(element);
        temp.push({ symbol: data.allSymbol[index], tokenAddr: data.allTokenAddr[index], poolAddr: data.allTeemoPoolAddr[index] });
      });
    }
    dispatch(createAction(Types.POOL_LIST)(temp));
  };
};

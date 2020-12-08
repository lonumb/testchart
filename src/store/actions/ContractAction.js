import { createAction } from 'redux-actions';
import * as Types from '../types';

/**
 * 池子列表
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
    dispatch(createAction(Types.POOL_INFO)(temp[0]));
  };
};

// 更新当前池子信息
export const actionPoolInfo = (data) => {
  return (dispatch) => {
    dispatch(createAction(Types.POOL_INFO)(data));
  };
};

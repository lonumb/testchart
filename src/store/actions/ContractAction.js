import { createAction } from 'redux-actions';
import * as Types from '../types';

/**
 * 池子列表
 * @param {*} params
 */
export const actionPoolList = (params) => {
  const { data } = params;
  return (dispatch) => {
    dispatch(createAction(Types.POOL_LIST)(data));
    dispatch(createAction(Types.POOL_INFO)(data[0]));
  };
};

// 更新当前池子信息
export const actionPoolInfo = (data) => {
  return (dispatch) => {
    dispatch(createAction(Types.POOL_INFO)(data));
  };
};

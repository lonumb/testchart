import { createAction } from 'redux-actions';
import * as Types from '../types';
import * as HttpUtil from '../../utils/HttpUtil';

/**
 * 更新产品列表信息
 */
export const actionProductList = () => {
  return (dispatch, chainId) => {
    dispatch(getProductInfoFunc({ loading: true }));
    HttpUtil.URLENCODED_GET('/api/trade/queryproductinfo2.do', {chainId})
      .then((res) => {
        let products = [];
        res.datas.forEach((element) => {
          products.push({ ...element, symbol: element.symbol.toUpperCase(), legalSymbol: 'USDT' });
        });
        // 产品信息加载中
        dispatch(createAction(Types.PRODUCT_LIST)({ productList: products }));
        // 更新产品信息
        dispatch(getProductInfoFunc({ product: products[0] || {}, loading: false }));
      })
      .catch((error) => {
        dispatch(getProductInfoFunc({ loading: false }));
      });

    //
  };
};

/**
 * 获取产品信息action
 */
const getProductInfoFunc = (params) => {
  const { product = {}, loading } = params;
  return createAction(Types.PRODUCT_INFO)({ product, loading });
};

/**
 * 更新产品信息
 * @param {*} product
 */
export const actionProductInfo = (product) => {
  return (dispatch) => {
    // 产品列表加载中
    dispatch(getProductInfoFunc({ product }));
  };
};

// 切换周期
export const actionPeriodUpdate = (period) => {
  return (dispatch) => {
    dispatch(createAction(Types.CURRENT_PERIOD)(period));
  };
};

/**
 * 历史k线数据
 * @param {*} params
 */
export const apiKData = (params) => {
  let { symbol, type, period, fromtime, count, chainId } = params;
  let paramsTemp = { symbol: symbol.toLowerCase(), ktype: period, fromtime, totime: '0', chainId };
  if (count) paramsTemp['count'] = count;
  let func = (res) => {
    let result = [];
    if (res.datas) {
      // 数据处理
      res.datas.forEach((element) => {
        result.push({
          time: parseInt(element.T) * 1000,
          open: parseFloat(element.O),
          high: parseFloat(element.H),
          low: parseFloat(element.L),
          close: parseFloat(element.C),
          volume: parseFloat(element.num || 0),
        });
      });
    }
    return result;
  };

  if (type === 1 || type === 2) {
    return HttpUtil.URLENCODED_POST('/api/hq/getmink.do', paramsTemp).then((res) => {
      return func(res);
    });
  } else if (type === 3) {
    return HttpUtil.URLENCODED_POST('/api/hq/getdayk.do', paramsTemp).then((res) => {
      return func(res);
    });
  }
};

/**
 * ticker行情更新
 * @param {*} data
 */
export const actionTickerUpdate = (data) => {
  return (dispatch) => {
    dispatch(createAction(Types.TICKER_UPDATE)(data));
  };
};

export const actionQuote = (data) => {
  return (dispatch) => {
    dispatch(createAction(Types.QUOTE)(data));
  };
};

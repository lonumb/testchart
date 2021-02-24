import { createAction } from 'redux-actions';
import * as Types from '../types';
import * as HttpUtil from '../../utils/HttpUtil';
import { products } from '../../utils/Config'
/**
 * 更新产品列表信息
 */
export const actionProductList = () => {
//   {
//     "index": 12,
//     "symbol": "EOS",
//     "name": "柚子",
//     "decimal": "4",
//     "unit": "0.001",
//     "maxtotalamount": "100000.00",
//     "fee": "0.0004",
//     "fee2": "0.0004",
//     "isoptions": "0",
//     "levermin": "5",
//     "levermax": "100",
//     "leverdefault": "100",
//     "leverlist": "5,10,20,30,50,75,100",
//     "amountmin": "2.00",
//     "amountmax": "100000.00",
//     "marginratio": "0.00001",
//     "spreadbuy": "0.0005",
//     "spreadsell": "0.0005",
//     "fundfeetime": "1611561600",
//     "fundfeedirect": "0",
//     "fundfeeratio": "0.0001",
//     "legalSymbol": "USDT"
// },
  return (dispatch, chainId) => {
    // 产品信息加载中
    dispatch(createAction(Types.PRODUCT_LIST)({ productList: products }));  
    dispatch(getProductInfoFunc({ product: products[0] || {}, loading: false }));
  };

  // return (dispatch, chainId) => {
  //   dispatch(getProductInfoFunc({ loading: true }));

  //   HttpUtil.URLENCODED_GET('/api/trade/queryproductinfo2.do', {chainId})
  //     .then((res) => {
  //       let products = [];
  //       res.datas.forEach((element) => {
  //         products.push({ ...element, symbol: element.symbol.toUpperCase(), legalSymbol: 'USDT' });
  //       });
  //       // 产品信息加载中
  //       dispatch(createAction(Types.PRODUCT_LIST)({ productList: products }));
  //       // 更新产品信息
  //       dispatch(getProductInfoFunc({ product: products[0] || {}, loading: false }));
  //     })
  //     .catch((error) => {
  //       dispatch(getProductInfoFunc({ loading: false }));
  //     });
  // };
};

export const actionTradeHistoryList = (tradeHistoryList) => {
  return (dispatch) => {
    dispatch(createAction(Types.TRADE_HISTORY_LIST)({ tradeHistoryList }));  
  };
};

export const actionAddTradeHistory = (tradeHistory) => {
  return (dispatch) => {
    dispatch(createAction(Types.ADD_TRADE_HISTORY)({ tradeHistory }));  
  };
};

export const actionUpdateTradeHistory = (tradeHistory) => {
  return (dispatch) => {
    dispatch(createAction(Types.UPDATE_TRADE_HISTORY)({ tradeHistory }));  
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

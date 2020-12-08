import * as Types from '../types';
import * as Tools from '../../utils/Tools';

const defaultState = {
  loading: false,
  productInfo: { symbol: '', legaiSymbol: '' },
  productList: [],
  period: '1',
  ticker: {},
  tickerAll: { '1D': {} },
};

const tradeReducer = (state = defaultState, action) => {
  let nextState = {};
  let params = action.payload;
  switch (action.type) {
    case Types.PRODUCT_LIST:
      let { productList = [] } = params;
      nextState = { ...state, productList };
      break;

    case Types.PRODUCT_INFO:
      let { loading, product = {} } = params;
      nextState = { ...state, productInfo: product, loading };
      break;

    case Types.CURRENT_PERIOD:
      nextState = { ...state, period: params };
      break;

    case Types.TICKER_UPDATE:
      let { T, O, H, L, C, num = 0, datatype } = params;
      let ticker = {
        time: parseInt(T) * 1000,
        open: parseFloat(O),
        high: parseFloat(H),
        low: parseFloat(L),
        close: parseFloat(C),
        volume: parseFloat(num),
      };
      if (datatype === 'dayk') {
        if (state.period === '1D') {
          nextState = { ...state, ticker };
        } else {
          // 最新价颜色
          let oldPrice = state.tickerAll['1D'].C || 0;
          let newPrice = ticker.C || 0;
          ticker['CC'] = newPrice > oldPrice ? 'green' : 'red';
          //涨跌幅计算及颜色
          let diff = Tools.sub(ticker.C || 0, params.PC || 0);
          if (Tools.LT(diff, 0)) {
            ticker['UDC'] = 'red';
          }
          if (Tools.GT(diff, 0)) {
            ticker['UDC'] = 'green';
          }
          ticker['UD'] = Tools.fmtToFixed(Tools.abs(diff || 0), 2);
          // 涨跌幅
          ticker['UDR'] = params.PC ? Tools.fmtToFixed(Tools.mul(Tools.div(Tools.abs(diff), params.PC || 0), 100), 2) : 0;

          nextState = { ...state, tickerAll: { '1D': ticker } };
        }
      } else {
        nextState = { ...state, ticker };
      }

      break;

    default:
      nextState = { ...state };
      break;
  }
  return nextState;
};

export default tradeReducer;

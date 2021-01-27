import * as Types from '../types';
import * as Tools from '../../utils/Tools';

const defaultState = {
  loading: false,
  productInfo: { symbol: '', legaiSymbol: '' },
  productList: [],
  period: '1',
  ticker: {},
  quote: {},
  quoteMap: {},
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

      var q = state.quoteMap[product.symbol.toLowerCase()];
      nextState = { ...state, quote: q || {}, productInfo: product, loading };
      break;

    case Types.CURRENT_PERIOD:
        nextState = { ...state, period: params };
        break;

    case Types.QUOTE:
      // C: "1329.92"
      // H: "1344.38"
      // L: "1211.80"
      // LP: "1329.92"
      // O: "1240.44"
      // PC: "1240.46"
      // S: "eth"
      // T: "1611027000"
      // datatype: "snap"
        let quote = {
          close: parseFloat(params.C),
          high: parseFloat(params.H),
          low: parseFloat(params.L),
          open: parseFloat(params.O),
          preClose: parseFloat(params.PC),
          prevClose: parseFloat(params.PC),
          symbol: params.S,
          time: parseInt(params.T) * 1000,
          datatype: params.datatype,
          volume: parseFloat(params.num || 0),
        };

        quote['UDR'] = Tools.fmtToFixed(((params.C - (params.PC || params.O)) / params.PC * 100), 2);
        quote['UDC'] = quote['UDR'] >= 0 ? 'green' : 'red';

        var quoteMap = state.quoteMap;
        let oldQuote = quoteMap[quote.symbol];
        if (oldQuote) {
          quote.lastPrice = oldQuote.close;
        }
        quoteMap[quote.symbol] = quote;

        if (state.productInfo.symbol.toLowerCase() == quote.symbol) {
          nextState = { ...state, quote, quoteMap };
        } else {
          nextState = { ...state, quoteMap };
        }
        break;
    
    case Types.TICKER_UPDATE:
      let { T, O, H, L, C, PC, S, num = 0, datatype } = params;
      let ticker = {
        time: parseInt(T) * 1000,
        open: parseFloat(O),
        high: parseFloat(H),
        low: parseFloat(L),
        close: parseFloat(C),
        prevClose: parseFloat(PC),
        symbol: S,
        volume: parseFloat(num),
      };
      if (datatype === 'dayk') {
        if (state.period === '1D') {
          nextState = { ...state, ticker };
        } else {
          // 最新价颜色
          let oldPrice = state.tickerAll['1D'].C || 0;
          let newPrice = ticker.C || 0;
          ticker['CC'] = newPrice > oldPrice ? 'red' : 'green';
          //涨跌幅计算及颜色
          let diff = Tools.sub(ticker.C || 0, params.PC || 0);
          if (Tools.GE(diff, 0)) {
            ticker['UDC'] = 'green';
          }
          if (Tools.LT(diff, 0)) {
            ticker['UDC'] = 'red';
          }
          ticker['UD'] = Tools.fmtToFixed(Tools.abs(diff || 0), 2);
          // 涨跌幅
          //ticker['UDR'] = params.PC ? Tools.fmtToFixed(Tools.mul(Tools.div(Tools.abs(diff), params.PC || 0), 100), 2) : 0;
          //UDR
          ticker['UDR'] = Tools.fmtToFixed(((params.C - (params.PC || params.O)) / ticker.prevClose * 100), 2);

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

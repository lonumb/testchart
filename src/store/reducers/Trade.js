import * as Types from '../types';

const defaultState = {
  loading: false,
  productInfo: { symbol: '', legaiSymbol: '' },
  productList: [],
  period: '1',
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

    default:
      nextState = { ...state };
      break;
  }
  return nextState;
};

export default tradeReducer;

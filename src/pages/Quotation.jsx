import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import './quotation.scss';

import MarketComponent from '../components/quotation/MarketComponent';
import ChartComponent from '../components/quotation/ChartComponent';
import PoolComponent from '../components/quotation/PoolComponent';
import RecordComponent from '../components/quotation/RecordComponent';
import OrderComponent from '../components/quotation/OrderComponent';
import EntrustComponent from '../components/quotation/entrust/EntrustComponent';

import { actionProductList } from '../store/actions/TradeAction';
import WsUtil from '../utils/WsUtil';

const periodMap = { line: '1mink', 1: '1mink', 5: '5mink', 15: '15mink', 30: '30mink', 60: '60mink', 240: '240mink', '1D': 'dayk', '1W': 'weekk', '1M': 'monthk' };

const Quotation = (props) => {
  const dispatch = useDispatch();
  const { productInfo, period } = useSelector((state) => state.trade);

  useEffect(() => {
    // 查询币种列表(产品)
    actionProductList()(dispatch);
  }, []);

  // websocket订阅
  useEffect(() => {
    if (!productInfo.symbol) return;
    WsUtil.init(dispatch, () => {
      WsUtil.sendMsg('13007', {
        sub: [{ symbol: productInfo.symbol.toLowerCase(), datatype: [periodMap[period], periodMap['1D']] }],
      });
    });
    return () => {
      // 关闭
      WsUtil.close();
    };
  }, [productInfo, period]);

  return (
    <div className="quotation-page">
      <MarketComponent></MarketComponent>
      <ChartComponent></ChartComponent>
      <PoolComponent></PoolComponent>
      <RecordComponent></RecordComponent>
      <OrderComponent></OrderComponent>
      <EntrustComponent></EntrustComponent>
    </div>
  );
};

export default Quotation;

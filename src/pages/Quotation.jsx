import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import './quotation.scss';

import MarketComponent from '../components/quotation/MarketComponent';
import ChartComponent from '../components/quotation/ChartComponent';
import PoolComponent from '../components/quotation/PoolComponent';
import RecordComponent from '../components/quotation/RecordComponent';
import OrderComponent from '../components/quotation/OrderComponent';
import EntrustComponent from '../components/quotation/EntrustComponent';

import { actionProductList } from '../store/actions/TradeAction';

function Quotation() {
  const dispatch = useDispatch();

  useEffect(() => {
    // 查询币种列表
    actionProductList()(dispatch);
  }, []);

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
}

export default Quotation;

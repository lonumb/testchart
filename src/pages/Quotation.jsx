import React from 'react';
import './quotation.scss';

import HeaderComponent from '../components/quotation/HeaderComponent';
import MarketComponent from '../components/quotation/MarketComponent';
import ChartComponent from '../components/quotation/ChartComponent';
import PoolComponent from '../components/quotation/PoolComponent';
import RecordComponent from '../components/quotation/RecordComponent';
import OrderComponent from '../components/quotation/OrderComponent';
import EntrustComponent from '../components/quotation/EntrustComponent';

function Quotation() {
  return (
    <div className="quotation-page">
      <HeaderComponent></HeaderComponent>
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

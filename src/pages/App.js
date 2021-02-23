/**
 * 路由路口, 全局数据数据获取
 */

import React, { useEffect } from 'react';
import AppRouter from '../routers';

import { useSelector, useDispatch } from 'react-redux';
import { useWeb3React } from '@web3-react/core';
import PoolProxyContract from '../common/contract/PoolProxyContract';
import { actionPoolList } from '../store/actions/ContractAction';
import { actionTradeHistoryList } from '../store/actions/TradeAction'

function App() {
  const { tradeHistoryList } = useSelector((state) => state.trade);
  const { library, account, chainId } = useWeb3React();
  const dispatch = useDispatch();

  useEffect(async () => {
    if (!library || !account) return;
    let poolProxyContract = new PoolProxyContract(library, chainId, account);
    poolProxyContract.getAllPoolInfo().then((res) => {
      actionPoolList({ data: res })(dispatch);
    }).catch((e) => console.log);

    if (tradeHistoryList.length > 0) return;
    let str = window.localStorage.getItem('tradeHistoryList');
    if (str) {
      let list = JSON.parse(str) || [];
      actionTradeHistoryList(list)(dispatch);
    }
  }, [library, account]);

  // useEffect(async () => {
  //   console.log("哈哈");
  //   if (tradeHistoryList.length > 0) return;
  //   let str = window.localStorage.getItem('tradeHistoryList');
  //   if (str) {
  //     let list = JSON.parse(str) || [];
  //     actionTradeHistoryList()(dispatch, list);
  //   }
  // });

  return <AppRouter />;
}

export default App;

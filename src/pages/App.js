/**
 * 路由路口, 全局数据数据获取
 */

import React, { useEffect } from 'react';
import AppRouter from '../routers';

import { useSelector, useDispatch } from 'react-redux';
import { useWeb3React } from '@web3-react/core';
import PoolContract from '../common/contract/PoolContract';
import { actionPoolList } from '../store/actions/ContractAction';

function App() {
  const { library, account } = useWeb3React();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!library || !account) return;
    let poolContract = new PoolContract(library, account);
    let getData = async () => {
      let poolListInfo = await poolContract.getAllPoolInfo();
      actionPoolList({ data: poolListInfo })(dispatch);
    };
    getData();
  }, [library, account]);

  return <AppRouter />;
}

export default App;

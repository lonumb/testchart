import React, { useState, useEffect, Fragment, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useWeb3React } from '@web3-react/core';
import { useSelector, useDispatch } from 'react-redux';
import Table from '../../components/table/OwnTable';
import TableHead from '../../components/table/OwnTableHead';
import TableBody from '../../components/table/OwnTableBody';
import TableRow from '../../components/table/OwnTableRow';
import TableCell from '../../components/table/OwnTableCell';
import NativeSelect from '@material-ui/core/NativeSelect';
import OwnInput from '../../components/form/OwnInput';
import OwnDateRange from '../../components/form/OwnDateRange';
import PoolProxyContract from '../../common/contract/PoolProxyContract';
import SwapTradeContract from '../../common/contract/SwapTradeContract';
import * as Tools from '../../utils/Tools';
import { BSFLAG_LONG, BSFLAG_SHORT } from '../../utils/Constants'
import { fromWei, toBN, toWei } from 'web3-utils';

import './userCapticalRecord.scss';

function createData(name, calories, fat, carbs, protein) {
  return { name, calories, fat, carbs, protein };
}

const rows = [createData('BTC11', 882931.762814, '0.000000', '0.000000', '0.000000'), createData('USDT', 11.000128, '0.000000', '0.000000', '0.000000')];

let poolProxyContract = null;
let swapTradeContract;

const UserAccount = () => {
  const { active, library, account, chainId } = useWeb3React();
  const { t } = useTranslation();
  const [type, setType] = useState(3); // 类型
  const [currency, setCurrency] = useState(''); // 币种
  const [dateRange, setDateRange] = useState([new Date(), new Date()]);
  const [orderList, setOrderList] = useState([]);
  const [limitOrderList, setLimitOrderList] = useState([]);
  const { poolList } = useSelector((state) => state.contract);
  const { poolInfo, setPoolInfo } = useState(null);

  function isAvailable() {
    return active && account && poolList;
  }

  async function getData() {
    console.log('UserCapticalRecord getData available: ', isAvailable());
    if (!isAvailable()) {
      return Promise.error('not available');
    }
    return Promise.all([
      poolProxyContract.getAllOrder(poolList).then((res) => {
        console.log('UserCapticalRecord setAllOrder: ', res);
        setOrderList(res || []);
      }),
      poolProxyContract.getAllLimitOrder(poolList).then((res) => {
        console.log('UserCapticalRecord setAllLimitOrder: ', res);
        setLimitOrderList(res || []);
      }),
    ]);
  }

  const getDataFunc = async () => {
    var retryCount = 0;
    while (retryCount < 5) {
      try {
        await getData();
        return
      } catch (e) {
        retryCount++;
      }
    }
  };

  useEffect(async () => {
    if (active && account && poolList) {
      poolProxyContract = new PoolProxyContract(library, chainId, account);    
      swapTradeContract = new SwapTradeContract(library, chainId, account);

      getDataFunc();
    } else {
      poolProxyContract = null;
      swapTradeContract = null;
    }
  }, [active, library, account, poolList]);

  useEffect(async () => {
    if (!poolInfo && poolList && poolList.length > 0) {
      //setPoolInfo(poolList[0]);
    }
  }, [poolList]);

  const currencyChange = (event) => {
    setCurrency(event.target.value);
  };

  // 搜索查询
  function handleSearch() {
    console.log(dateRange);
  }

  // 重置
  function handleReset() {}

  const formatLimitOrderStatus = (order) => {
    switch (order.status) {
      case "1": {
        return '已撤单';
      }
      case "2": {
        return '未成交';
      }
      case "3": {
        return '已成交';
      }
    }
    return '--';
  }

  return (
    <div className="user-capital-record">
      <div className="head-box">
        <div className="title">{t('menuRecord')}</div>
        <ul className="tab-box">
          {/* <li className={`item ${type === 1 ? 'active' : ''}`} onClick={() => setType(1)}>
            {t('textRecharge')}
          </li>
          <li className={`item ${type === 2 ? 'active' : ''}`} onClick={() => setType(2)}>
            {t('textWithdraw')}
          </li> */}
          <li className={`item ${type === 3 ? 'active' : ''}`} onClick={() => setType(3)}>
            {t('textEntrust')}
          </li>
          <li className={`item ${type === 4 ? 'active' : ''}`} onClick={() => setType(4)}>
            {t('textClose')}
          </li>
          {/* <li className={`item ${type === 5 ? 'active' : ''}`} onClick={() => setType(5)}>
            {t('navPool')}
          </li> */}
        </ul>
      </div>
      <div className="search-box">
        {/* <div className="form-ele-box">
          <label htmlFor="">{t('textTime')}(UTC+8)</label>
          <div className="from-ele">
            <OwnDateRange onChange={setDateRange} value={dateRange} clearIcon={null} format="y-MM-dd" />
          </div>
        </div> */}
        <div className="form-ele-box">
          <label htmlFor="">{t('textCurrency')}</label>
          <div className="from-ele">
            <NativeSelect value={currency} onChange={currencyChange} input={<OwnInput />}>
              <option value="">全部</option>
              {poolList.map((item, index) => (
                  <option key={item.symbol} value={item.symbol}>{item.symbol}</option>  
              ))}
            </NativeSelect>
          </div>
        </div>

        {/* <div className="form-ele-box">
          <label htmlFor=""></label>
          <div className="from-ele">
            <button className="btn-default" onClick={() => handleReset()}>
              {t('btnReset')}
            </button>
            <button className="btn-primary" onClick={() => handleSearch()}>
              {t('btnSearch')}
            </button>
          </div>
        </div> */}
      </div>
      <div className="table-wrap">
        {/* {(type === 1) && (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>{t('textTime')}</TableCell>
                <TableCell>{t('textCurrency')}</TableCell>
                <TableCell>{t('textNum')}</TableCell>
                <TableCell>Txid</TableCell>
                <TableCell>{t('textStatus')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.name}>
                  <TableCell component="th" scope="row">
                    {row.name}
                  </TableCell>
                  <TableCell>{row.calories}</TableCell>
                  <TableCell>{row.fat}</TableCell>
                  <TableCell>{row.carbs}</TableCell>
                  <TableCell>已提交</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}

        {(type === 2) && (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>{t('textTime')}</TableCell>
                <TableCell>{t('textCurrency')}</TableCell>
                <TableCell>{t('textNum')}</TableCell>
                <TableCell>Txid</TableCell>
                <TableCell>{t('textStatus')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {limitOrderList.filter((item) => item.closePrice != 0).map((item, index) => (
                <TableRow key={item.symbol}>
                  <TableCell component="th" scope="row">
                  </TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell>已提交</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )} */}

        {type === 3 && (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>{t('textTime')}</TableCell>
                <TableCell>{t('textProductCode')}</TableCell>
                {/* <TableCell>{t('textType')}</TableCell> */}
                <TableCell>{t('textDir')}</TableCell>
                <TableCell>{t('textPrice')}</TableCell>
                <TableCell>{t('textBond')}</TableCell>
                <TableCell>{t('textLever')}</TableCell>
                <TableCell>{t('textProfit')}</TableCell>
                <TableCell>{t('textStop')}</TableCell>
                {/* <TableCell>Txid</TableCell> */}
                <TableCell>{t('textStatus')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {limitOrderList.filter((item) => currency == '' || currency == item.openSymbol).map((item) => (
                <TableRow key={item.orderId}>
                  <TableCell component="th" scope="row">
                    {Tools.formatTime(item.openTime)}
                  </TableCell>
                  <TableCell>{item.symbol}</TableCell>
                  {/* <TableCell></TableCell> */}
                  <TableCell>{item.bsFlag == BSFLAG_LONG ? '买涨' : '买跌'}</TableCell>
                  <TableCell>{fromWei(item.openPrice)}</TableCell>
                  <TableCell>{Tools.fromWei(item.tokenAmount, item.poolInfo.decimals)} { item.openSymbol }</TableCell>
                  <TableCell>{item.lever} X</TableCell>
                  <TableCell>{item.pLimitPrice != 0 ? fromWei(item.pLimitPrice) : '未设置'}</TableCell>
                  <TableCell>{item.lLimitPrice != 0 ? fromWei(item.lLimitPrice) : '未设置'}</TableCell>
                  {/* <TableCell></TableCell> */}
                  <TableCell>{formatLimitOrderStatus(item)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
        {type === 4 && (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>{t('textCloseTime')}</TableCell>
                <TableCell>{t('textProductCode')}</TableCell>
                <TableCell>{t('textClosePrice')}</TableCell>
                <TableCell>{t('textBond')}</TableCell>
                <TableCell>{t('textLever')}</TableCell>
                {/* <TableCell>{t('textProfitStop')}</TableCell> */}
                {/* <TableCell>Txid</TableCell> */}
                {/* <TableCell>{t('textCloseType')}</TableCell> */}
              </TableRow>
            </TableHead>
            <TableBody>
              {orderList.filter((item) => (currency == '' || currency == item.openSymbol) && item.closePrice != 0).map((item) => (
                <TableRow key={item.orderId}>
                  <TableCell component="th" scope="row">
                    {Tools.formatTime(item.openTime)}
                  </TableCell>
                  <TableCell>{item.symbol}</TableCell>
                  <TableCell>{Tools.fromWei(item.closePrice, 18)}</TableCell>
                  <TableCell>{Tools.fromWei(item.tokenAmount, item.poolInfo.decimals)} { item.openSymbol }</TableCell>
                  <TableCell>{item.lever} X</TableCell>
                  {/* <TableCell>--</TableCell> */}
                  {/* <TableCell></TableCell> */}
                  {/* <TableCell></TableCell> */}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
        {/* {type === 5 && (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>{t('textCloseTime')}(UTC+8)</TableCell>
                <TableCell>{t('navPool')}</TableCell>
                <TableCell>{t('textType')}</TableCell>
                <TableCell>{t('textNum')}</TableCell>
                <TableCell>LPToken</TableCell>
                <TableCell>Txid</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.name}>
                  <TableCell component="th" scope="row">
                    {row.name}
                  </TableCell>
                  <TableCell>{row.calories}</TableCell>
                  <TableCell>{row.fat}</TableCell>
                  <TableCell>{row.carbs}</TableCell>
                  <TableCell>{row.carbs}</TableCell>
                  <TableCell>{row.carbs}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )} */}
      </div>
    </div>
  );
};

export default UserAccount;

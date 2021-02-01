import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useWeb3React } from '@web3-react/core';
import { useSelector, useDispatch } from 'react-redux';
import PoolProxyContract from '../../common/contract/PoolProxyContract';
import * as Tools from '../../utils/Tools';
import './pool.scss';
import * as HttpUtil from '../../utils/HttpUtil';

let poolProxyContract;
const PoolComponent = () => {
  
  const { t } = useTranslation();
  const { active, library, account, chainId } = useWeb3React();
  const poolRef = useRef(0);
  const [ poolHeight, setPoolHeight ] = useState(0);
  const { poolInfo } = useSelector((state) => state.contract);
  const [ positionInfo, setPositionInfo ] = useState({});
  const [ poolFund, setPoolFund ] = useState({});
  const [ refreshObj, setRefreshObj ] = useState({});
  const { quote } = useSelector((state) => {
    return state.trade;
  });

  // function isAvailable() {
  //   return active && account && poolInfo && poolInfo.poolAddr;
  // }

  // async function getData() {
  //   console.log('PoolComponent getData available: ', isAvailable());
  //   if (!isAvailable()) {
  //     return Promise.error('not available');
  //   }
  //   return Promise.all([
  //     poolProxyContract.getPositionInfo(poolInfo.poolAddr).then((res) => {
  //       console.log('PoolComponent setPositionInfo: ', res);
  //       setPositionInfo(res);
  //     }),
  //   ]);
  // }

  // const getDataFunc = async () => {
  //   var retryCount = 0;
  //   while (retryCount < 5) {
  //     try {
  //       await getData();
  //       return
  //     } catch (e) {
  //       retryCount++;
  //     }
  //   }
  // };

  // useEffect(() => {
  //   if (active && account && poolInfo.poolAddr) {
  //     console.log('poolInfo: ', poolInfo);
  //     poolProxyContract = new PoolProxyContract(library, chainId, account);

  //     getDataFunc();
  //   } else {
  //     poolProxyContract = null;
  //   }
  // }, [active, library, account, poolInfo]);

  // const getFormatPosition = (position) => {
  //   var result = Tools.fromWei(position || '0', (poolInfo ? poolInfo.decimals : 0));
  //   if (result < 0) {
  //     result = 0;
  //   }
  //   return Tools.toStringAsFixed(result, poolInfo.openDecimal);
  // }

  // const getLongFormatPositionRate = (poolInfo) => {
  //   var totalP = getFormatPosition(poolInfo.totalP);
  //   var total = Tools.fromWei(Tools.div(positionInfo.totalAmount || 0, 2), poolInfo ? poolInfo.decimals : 0);
  //   return Tools.numFmt(totalP / total, 2);
  // }

  // const getShortFormatPositionRate = () => {
  //   var totalL = getFormatPosition(poolInfo.totalP);
  //   var total = Tools.fromWei(Tools.div(positionInfo.totalAmount || 0, 2), poolInfo ? poolInfo.decimals : 0);
  //   return Tools.numFmt(totalL / total, 2);
  // }

  useEffect(() => {
    // 设置列表高度
    setPoolHeight(poolRef.current.scrollHeight - 65);
  }, []);

  const getData = async () => {
    var addr = '';
    if (poolInfo) {
      addr = poolInfo.poolAddr;
    }
    const fund = await HttpUtil.URLENCODED_GET('/api/order/querypoolfund.do', {chainId, addr });
    //console.log('PoolComponment setPoolFund: ', fund);
    setPoolFund(fund);
  };

  useEffect(() => {
    getData();
  }, [poolInfo]);

  useEffect(async () => {
    try {
      await getData();
    } catch (e) {
      console.log(e);
    }
  }, [refreshObj]);

  useEffect(async () => {
    try {
      await getData();
    } catch (e) {
      console.log(e);
    }
  }, [quote]);

  // useEffect(() => {
  //   let timer = undefined;
  //   if (!timer) {
  //     timer = setInterval(async () => {
  //       setRefreshObj({});
  //     }, 1000);
  //   }
  //   return () => {
  //     clearInterval(timer);
  //   };
  // }, []);

  const getLongFormatPositionRate = () => {
    if (!poolFund || !poolFund.f_pool_addr || poolFund.f_token_amount_long == 0) return '0';
    var amount = poolFund.f_long_plamount;
    if (amount < 0) {
      amount = 0;
    }
    var result = amount / poolFund.f_token_amount_long;
    if (result > 1) {
      console.log('getLongFormatPositionRate > 1, ', result, poolFund)
    }
    return Tools.numFmt(result * 100, 2);
  };

  const getShortFormatPositionRate = () => {
    if (!poolFund || !poolFund.f_pool_addr || poolFund.f_token_amount_short == 0) return '0';
    var amount = poolFund.f_short_plamount;
    if (amount < 0) {
      amount = 0;
    }
    var result = amount / poolFund.f_token_amount_short;
    return Tools.numFmt(result * 100, 2);
  };

  return (
    <div className="pool" ref={poolRef}>
      <div className="title-box">{t('navPool')}({poolInfo.symbol})</div>
      <div className="rate-box">
        <div className="block-column block-red">
          <div className="block" style={{ height: `${getLongFormatPositionRate(poolFund)}%` }}></div>
        </div>
        <div className="block-column block-green" >
          <div className="block" style={{ height: `${getShortFormatPositionRate(poolFund)}%` }}></div>
        </div>
        <div className="block-info">
          <div className="row">
            <span className="label0">{t('poolMany')}</span>
            <span className="label1">{t('poolCirculate')}:</span>
            <span className="label2">{ Tools.toStringAsFixed(poolFund.f_token_amount_long, 2) }</span>
            <span className="label3">({Tools.numFmt(100 - getLongFormatPositionRate(poolFund), 2)}%)</span>
            <span className="label1">{t('poolPosition')}:</span>
            <span className="label2">{ Tools.toStringAsFixed(poolFund.f_long_plamount >= 0 ? poolFund.f_long_plamount : '0', 2) }</span>
            <span className="label3">({getLongFormatPositionRate(poolFund)}%)</span>
          </div>
          <div className="row">
            <span className="label0">{t('poolEmpty')}</span>
            <span className="label1">{t('poolCirculate')}:</span>
            <span className="label2">{ Tools.toStringAsFixed(poolFund.f_token_amount_short, 2) }</span>
            <span className="label3">({Tools.numFmt(100 - getShortFormatPositionRate(poolFund), 2)}%)</span>
            <span className="label1">{t('poolPosition')}:</span>
            <span className="label2">{ Tools.toStringAsFixed(poolFund.f_short_plamount >= 0 ? poolFund.f_short_plamount : '0', 2) }</span>
            <span className="label3">({getShortFormatPositionRate(poolFund)}%)</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PoolComponent;

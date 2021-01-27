import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useWeb3React } from '@web3-react/core';
import { useSelector, useDispatch } from 'react-redux';
import PoolProxyContract from '../../common/contract/PoolProxyContract';
import * as Tools from '../../utils/Tools';
import './pool.scss';

let poolProxyContract;
const PoolComponent = () => {
  const { t } = useTranslation();
  const { active, library, account, chainId } = useWeb3React();
  const poolRef = useRef();
  const [poolHeight, setPoolHeight] = useState(0);
  const { poolInfo } = useSelector((state) => state.contract);
  const { productInfo } = useSelector((state) => state.trade);
  const [positionInfo, setPositionInfo] = useState({});

  function isAvailable() {
    return active && account && poolInfo && poolInfo.poolAddr;
  }

  async function getData() {
    console.log('PoolComponent getData available: ', isAvailable());
    if (!isAvailable()) {
      return Promise.error('not available');
    }
    return Promise.all([
      poolProxyContract.getPositionInfo(poolInfo.poolAddr).then((res) => {
        console.log('PoolComponent setPositionInfo: ', res);
        setPositionInfo(res);
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

  useEffect(() => {
    // 设置列表高度
    setPoolHeight(poolRef.current.clientHeight - 65);
  }, []);

  useEffect(() => {
    if (active && account && poolInfo.poolAddr) {
      console.log('poolInfo: ', poolInfo);
      poolProxyContract = new PoolProxyContract(library, chainId, account);

      getDataFunc();
    } else {
      poolProxyContract = null;
    }
  }, [active, library, account, poolInfo]);

  const getFormatPosition = (position) => {
    var result = Tools.fromWei(position || '0', (poolInfo ? poolInfo.decimals : 0));
    if (result < 0) {
      result = 0;
    }
    return Tools.toStringAsFixed(result, poolInfo.openDecimal);
  }

  const getLongFormatPositionRate = (poolInfo) => {
    var totalP = getFormatPosition(poolInfo.totalP);
    var total = Tools.fromWei(Tools.div(positionInfo.totalAmount || 0, 2), poolInfo ? poolInfo.decimals : 0);
    return Tools.numFmt(totalP / total, 2);
  }

  const getShortFormatPositionRate = () => {
    var totalL = getFormatPosition(poolInfo.totalP);
    var total = Tools.fromWei(Tools.div(positionInfo.totalAmount || 0, 2), poolInfo ? poolInfo.decimals : 0);
    return Tools.numFmt(totalL / total, 2);
  }

  return (
    <div className="pool" ref={poolRef}>
      <div className="title-box">{t('navPool')}({poolInfo.symbol})</div>
      <div className="rate-box">
        <div className="block-column block-red" style={{ height: `${poolHeight}px` }}>
          <div className="block" style={{ height: `${getLongFormatPositionRate(positionInfo)}%` }}></div>
        </div>
        <div className="block-column block-green" style={{ height: `${poolHeight}px` }}>
          <div className="block" style={{ height: `${getShortFormatPositionRate(positionInfo)}%` }}></div>
        </div>
        <div className="block-info">
          <div className="row">
            <span className="label0">{t('poolMany')}</span>
            <span className="label1">{t('poolCirculate')}:</span>
            <span className="label2">{Tools.numFmt(Tools.fromWei(Tools.div(positionInfo.totalAmount || 0, 2), poolInfo ? poolInfo.decimals : 0), poolInfo.openDecimal)}</span>
            <span className="label3">({Tools.numFmt(100 - getLongFormatPositionRate(positionInfo), 2)}%)</span>
            <span className="label1">{t('poolPosition')}:</span>
            <span className="label2">{getFormatPosition(positionInfo.totalP)}</span>
            <span className="label3">({getLongFormatPositionRate(positionInfo)}%)</span>
          </div>
          <div className="row">
            <span className="label0">{t('poolEmpty')}</span>
            <span className="label1">{t('poolCirculate')}:</span>
            <span className="label2">{Tools.numFmt(Tools.fromWei(Tools.div(positionInfo.totalAmount || 0, 2), poolInfo ? poolInfo.decimals : 0), poolInfo.openDecimal)}</span>
            <span className="label3">({Tools.numFmt(100 - getShortFormatPositionRate(positionInfo), 2)}%)</span>
            <span className="label1">{t('poolPosition')}:</span>
            <span className="label2">{getFormatPosition(positionInfo.totalL)}</span>
            <span className="label3">({getShortFormatPositionRate(positionInfo)}%)</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PoolComponent;

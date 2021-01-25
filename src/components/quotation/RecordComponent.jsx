import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { useWeb3React } from '@web3-react/core';
import Reply from '@material-ui/icons/Reply';
import PoolProxyContract from '../../common/contract/PoolProxyContract';
import * as Tools from '../../utils/Tools';
import { fromWei, toBN, toWei } from 'web3-utils';
import './record.scss';

let poolProxyContract = null;

const RecordComponent = () => {
  const { t } = useTranslation();
  const { active, library, account, chainId } = useWeb3React();
  const { poolList } = useSelector((state) => state.contract);
  const [ refreshObj, setRefreshObj ] = useState({});

  const recordRef = useRef();
  const [recordList, setRecordList] = useState([]);
  const [listHeight, setListHeight] = useState(0);

  function isAvailable() {
    return active && account && poolList;
  }

  async function getData() {
    console.log('RecordComponent getData available: ', isAvailable());
    if (!isAvailable()) {
      return Promise.reject('not available');
    }
    return Promise.all([
      poolProxyContract.queryLastTrades(poolList).then(res => {
        console.log('RecordComponent setRecordList: ', res);
        setRecordList(res || []);
        return res;
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

  // useEffect(() => {
  //   if (chainId) {
  //     var lastLogsStr = global.localStorage.getItem(`lastLogs_${this._chainId}`);
  //     let lastLogs = JSON.parse(lastLogsStr) || [];
  //   }
  // }, [chainId]);

  useEffect(async () => {
    if (active && account && poolList.length > 0) {
      poolProxyContract = new PoolProxyContract(library, chainId, account);

      if (recordList.length == 0) {
        var list = poolProxyContract.getLocalLastTrades();
        console.log('RecordComponent local setRecordList: ', list);
        setRecordList(list || []);
      }
      getDataFunc();
    } else {
      poolProxyContract = null;
    }
  }, [active, library, account, poolList]);

  // useEffect(() => {
  //   // 设置记录列表
  //   setRecordList(new Array(50).fill({ a: 'aaa' }));
  // }, []);

  useEffect(() => {
    // 设置列表高度
    setListHeight(recordRef.current.clientHeight - 56);
  }, []);

  useEffect(async () => {
    try {
      await getData();
    } catch (e) {
      console.log(e);
    }
  }, [refreshObj]);

  useEffect(() => {
    let timer = undefined;
    if (!timer) {
      timer = setInterval(async () => {
        setRefreshObj({});
        // try {
        //   await getData();
        // } catch (e) {
        //   console.log(e);
        // }
      }, 10000);
    }
    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <div className="record" ref={recordRef}>
      <div className="title-box">{t('tradeDealTitle')}</div>
      <div className="list-title">
        <div className="column">{t('textTime')}</div>
        <div className="column">{t('textType')}</div>
        <div className="column">{t('textPrice')}(USDT)</div>
        <div className="column">{t('poolPosition')} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div>
      </div>
      <div className="list-wrap">
        <div className="list-view" style={{ height: `${listHeight}px` }}>
          {recordList.map((item, index) => {
            return (
              <div className="list-item" key={index}>
                <div className="column">{Tools.formatTime(item.time || new Date().getTime(), 'HH:mm:ss')}</div>
                <div className="column">{item._name == 'OpenMarketSwap' ? t('textBuild') 
                                : item._name == 'CloseMarketSwap' ? t('textClose') : ''}</div>
                <div className={`column ${index % 3 === 0 ? 'red' : 'green'}`}>{Tools.numFmt(Tools.fromWei(item.order.openPrice, item.decimals), 2)}</div>
                <div className="column">
                  {Tools.fromWei(item.order.tokenAmount, item.decimals)} {item.openSymbol} <Reply />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default RecordComponent;

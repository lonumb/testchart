import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { useWeb3React } from '@web3-react/core';
import Reply from '@material-ui/icons/Reply';
import PoolProxyContract from '../../common/contract/PoolProxyContract';
import * as Tools from '../../utils/Tools';
import { fromWei, toBN, toWei } from 'web3-utils';
import './record.scss';
import { BSFLAG_LONG } from '../../utils/Constants'
import * as HttpUtil from '../../utils/HttpUtil'

let poolProxyContract = null;

const RecordComponent = () => {
  const { t } = useTranslation();
  const { active, library, account, chainId } = useWeb3React();
  const { poolList } = useSelector((state) => state.contract);
  const { productList, productInfo } = useSelector((state) => state.trade);

  const [ refreshObj, setRefreshObj ] = useState({});

  const recordRef = useRef();
  const [recordList, setRecordList] = useState([]);
  const [listHeight, setListHeight] = useState(0);

  // function isAvailable() {
  //   return active && account && poolList;
  // }

  // async function getData() {
  //   console.log('RecordComponent getData available: ', isAvailable());
  //   if (!isAvailable()) {
  //     return Promise.reject('not available');
  //   }
  //   var pair = productInfo.pair;
  //   return Promise.all([
  //     poolProxyContract.queryLastTrades(poolList, pair).then(res => {
  //       if (pair == productInfo.pair) {
  //         console.log('RecordComponent setRecordList: ', res);
  //         setRecordList(res.reverse() || []);
  //       }
  //       return res;
  //     }).catch((e) => {
  //       console.log(`queryLastTrades err: `, e);
  //     }),
  //   ]);
  // }

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
    getDataFunc();
  }, [active, library, account, poolList, productInfo]);

  useEffect(() => {
    // 设置列表高度
    setListHeight(recordRef.current.clientHeight - 56);
  }, []);

  async function getData() {
    var pair = 'btc/usdt';
    if (productInfo) {
      pair = productInfo.pair;
    }
    return HttpUtil.URLENCODED_GET('/api/order/queryopeorders.do', {chainId, symbol: pair}).then(res => {
        if (pair == productInfo.pair) {
          console.log('RecordComponent setRecordList: ', res);
          setRecordList(res.datas || []);
        }
        return res;
      }).catch((e) => {
        console.log(`queryLastTrades err: `, e);
      });
  }

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
      }, 10000);
    }
    return () => {
      clearInterval(timer);
    };
  }, []);

  const formatPrice = (price, symbol) => {
    var productConfig = productList.find((item) => item.pair == symbol);
    if (productConfig) {
      return Tools.toStringAsFixed(price, productConfig.decimal);
    }
    return Tools.toStringAsFixed(price, 2);
  }

  return (
    <div className="record" ref={recordRef}>
      <div className="title-box">{t('tradeDealTitle')}</div>
      <div className="list-title">
        <div className="column">{t('textTime')}</div>
        <div className="column">{t('textType')}</div>
        <div className="column">{t('textPrice')}</div>
        <div className="column">{t('poolPosition')} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div>
      </div>
      <div className="list-wrap">
        <div className="list-view" style={{ height: `${listHeight}px` }}>
          {recordList.map((item, index) => {
            return (
              <div className="list-item" key={index}>
                <div className="column">{Tools.formatTime(item.f_time * 1000, 'HH:mm:ss')}</div>
                <div className="column">{item.f_status == 1 || item.f_status == 2 ? t('textBuild') 
                                : item.f_status == 4 || item.f_status == 5 || item.f_status == 6 || item.f_status == 7 ? t('textClose') : ''}</div>
                <div className={`column ${item.f_bs_flag == BSFLAG_LONG ? 'green' : 'red'}`}>{formatPrice(item.f_price, item.f_symbol)}</div>
                <div className="column">
                  {item.f_token_amount * item.f_lever} {item.f_token_symbol} <Reply />
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

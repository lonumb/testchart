import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Edit from '@material-ui/icons/Edit';
import SwapHorizIcon from '@material-ui/icons/SwapHoriz';
import OwnTooltip from '../../tooltip/OwnTooltip';
import OwnDialogModal from '../../modal/OwnDialog';

import { useSelector } from 'react-redux';
import './entrust.scss';

import { useWeb3React } from '@web3-react/core';
import TeemoPoolContract from '../../../common/contract/TeemoPoolContract';
import SwapTradeContract from '../../../common/contract/SwapTradeContract';
import PoolProxyContract from '../../../common/contract/PoolProxyContract';
//import HoldPositionComponent from './subModule/HoldPositionComponent'
import { BSFLAG_LONG, BSFLAG_SHORT } from '../../../utils/Constants'
import { fromWei, toBN, toWei } from 'web3-utils';
import * as Tools from '../../../utils/Tools';
import { emitter } from '../../../utils/event';

// 止盈比例列表
const profitRateList = [25, 50, 75, 100, 150, 200];
// 止损比例列表
const stopRateList = [30, 40, 50, 60, 70, 80];

let teemoPoolContract;
let swapTradeContract;
let poolProxyContract;

const EntrustComponent = () => {
  const { t } = useTranslation();
  const { active, library, account, chainId } = useWeb3React();
  const { poolInfo, poolList } = useSelector((state) => state.contract);
  const { productList, productInfo, quote, quoteMap } = useSelector((state) => state.trade); // 当前周期
  //console.log(productInfo, quote, quoteMap);
  //console.log(quote);
  //const [recordList] = useState(new Array(7).fill({ a: 'aaa' }));
  const [orderList, setOrderList] = useState([]);
  const [limitOrderList, setLimitOrderList] = useState([]);
  const [type, setType] = useState(1);

  //const [visible, setVisible] = useState(false);
  const [setTakeProfitStopLossOrder, setSetTakeProfitStopLossOrder] = useState(null);
  const [profitType, setProfitType] = useState(1); // 止盈类型
  const [takeProfit, setTakeProfit] = useState(''); // 止盈
  const [profitRate, setProfitRate] = useState(''); // 止盈比例
  const [stopLossType, setStopLossType] = useState(1); // 止损类型
  const [stopLoss, setStopLoss] = useState(''); // 止损
  const [stopLossRate, setStopLossRate] = useState(''); // 止损比例
  const [refreshDataObj, setRefreshDataObj] = useState({});

  function isAvailable() {
    return active && account && poolInfo && poolInfo.poolAddr;
  }

  async function getData() {
    console.log('EntrustComponent getData available: ', isAvailable());
    if (!isAvailable()) {
      return Promise.error('not available');
    }
    return Promise.all([
      poolProxyContract.getAllOrder(poolList).then((res) => {
        console.log('EntrustComponent getAllOrder: ', res);
        setOrderList(res || []);
      }),
      poolProxyContract.getAllLimitOrder(poolList).then((res) => {
        console.log('EntrustComponent getAllLimitOrder: ', res);
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

  useEffect(() => {
    emitter.on('refreshOrder', async () => { 
      console.log('refreshOrder', active, account , poolInfo, poolInfo.poolAddr);
      getDataFunc();
      setRefreshDataObj({});
    });
  }, [])

  useEffect(() => {
    let timer = undefined;
    if (!timer) {
      timer = setInterval(async () => {
        setRefreshDataObj({});
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

  useEffect(() => {
    getDataFunc();
  }, [refreshDataObj])

  useEffect(() => {
    if (active && account && poolInfo.poolAddr) {
      teemoPoolContract = new TeemoPoolContract(library, chainId, account);
      swapTradeContract = new SwapTradeContract(library, chainId, account);
      poolProxyContract = new PoolProxyContract(library, chainId, account);
      getDataFunc();
    } else {
      setOrderList([]);
      setLimitOrderList([]);
    }
    // let teemoContract = new TeemoContract(library, poolInfo.tokenAddr);
    // // 持仓列表
    // teemoContract.queryAllOrderList(account).then((res) => {
    //   console.log('持仓列表:', res);
    // });
  }, [active, library, account, poolInfo]);

  //平仓
  const onCloseOrderClick = (order) => {
    if (!order || order.openPrice == 0) return;
    teemoPoolContract
    .closeMarketSwap(order.poolInfo, order)
    .on('receipt', async (receipt) => {
      emitter.emit('refreshBalance');
      console.log('平仓成功');
      setOrderList(orderList.filter((item) => item.orderId != order.orderId));
      //await getData();
    });
  }

  //限价单撤销
  const onRevokeLimitOrderClick = (limitOrder) => {
    teemoPoolContract
    .cancelLimitSwap(limitOrder.poolInfo, limitOrder)
    .on('receipt', async (receipt) => {
      emitter.emit('refreshBalance');
      console.log('撤销成功');
      setLimitOrderList(limitOrderList.filter((item) => item.orderId != limitOrder.orderId));
      //await getData();
    });
  }

  //点击设置止盈止损按钮
  const onSetTakeProfitAndStopLossClick = (order) => {
    if (order.openPrice == 0) {
      return;
    }
    setSetTakeProfitStopLossOrder(order)
    setTakeProfit(order.pLimitPrice && order.pLimitPrice != '0' ? formatPrice(order.pLimitPrice, order.symbol) : '');
    setStopLoss(order.lLimitPrice && order.lLimitPrice != '0' ? formatPrice(order.lLimitPrice, order.symbol) : '');
  }

  // 修改止盈止损
  const onModifyTakeProfitAndStopLossClick = () => {
    if (!setTakeProfitStopLossOrder) return;
    let fixedTakeProfit = toWei((takeProfit || 0).toString());
    let fixedStopLoss = toWei((stopLoss || 0).toString());

    if (fixedTakeProfit == setTakeProfitStopLossOrder.pLimitPrice && fixedStopLoss == setTakeProfitStopLossOrder.lLimitPrice) {
      setSetTakeProfitStopLossOrder(null);
      return;
    }
    teemoPoolContract
    .updateSwapByPrice(setTakeProfitStopLossOrder.poolInfo, setTakeProfitStopLossOrder, fixedTakeProfit, fixedStopLoss)
    .on('receipt', async (receipt) => {
      alert('修改成功');
      var targetOrder = orderList.filter((item) => item.orderId != setTakeProfitStopLossOrder.orderId);
      if (targetOrder) {
        targetOrder.pLimitPrice = fixedTakeProfit;
        targetOrder.lLimitPrice = fixedStopLoss;
      }
      setSetTakeProfitStopLossOrder(null);
      await getData();
    });
  }

  const calcOrderPL = (order) => {
    var quote = quoteMap[order.symbol.split('/')[0]];
    var pl;
    if (quote) {
      var price = toWei(quote.close.toString());
      pl = Tools.calcOrderPL(price, order);
    }
    if (pl) {
      return Tools.toStringAsFixed(Tools.fromWei(pl, order.decimals), order.poolInfo.openDecimal);
    }
    return '--'
  }

  const calcForceClosePrice = (order) => {
    var price = Tools.calcForceClosePrice(order);
    if (price) {
      return formatPrice(price, order.symbol);
    }
    return '--'
  }

  const formatLimitOrderStatus = (order) => {
    switch (order.status) {
      case "1": {
        return t('listStatusRevoke');
      }
      case "2": {
        return t('Not_success');
      }
      case "3": {
        return t('listStatusDeal');
      }
    }
    return '--';
  }

  const formatPrice = (price, symbol) => {
    var productConfig = productList.find((item) => item.pair == symbol);
    if (productConfig) {
      return Tools.toStringAsFixed(fromWei(price), productConfig.decimal);
    }
    return fromWei(price);
  }

  return (
    <div className="entrust">
      <div className="tab-box">
        <ul>
          <li className={type === 1 ? 'active' : ''} onClick={() => setType(1)}>
            {t('entrustTabPosition')}
          </li>
          <li className={type === 2 ? 'active' : ''} onClick={() => setType(2)}>
            {t('entrustTabCurrent')}
          </li>
          <li className={type === 3 ? 'active' : ''} onClick={() => setType(3)}>
            {t('entrustTabHistory')}
          </li>
          <li className={type === 4 ? 'active' : ''} onClick={() => setType(4)}>
            {t('entrustTabClose')}
          </li>
        </ul>
      </div>
      <div className="table-box">
        {!active ? (
          <div className="no-login">
            <button className="btn-primary">{t('walletUnconnectTip')}</button>
          </div>
        ) : (<div></div>)}

        {/* 持仓 head */}
        {active && type === 1 && (
          <div className="table-head">
          <div className="table-column">{t('contract')}</div>
          <div className="table-column">{t('textDir')}</div>

          <div className="table-column tip-text">
            <OwnTooltip title={<React.Fragment>{t('entrustPriceDesc')}</React.Fragment>} arrow placement="bottom">
              <span>{t('entrustPrice')}</span>
            </OwnTooltip>
          </div>

          <div className="table-column">{t('textBond')}</div>
          <div className="table-column">{t('textLever')}</div>
          {/* <div className="table-column tip-text">
            <OwnTooltip title={<React.Fragment>{t('textCapitalDesc')}</React.Fragment>} arrow placement="bottom">
              <span>{t('textCapital')}</span>
            </OwnTooltip>
          </div>
          <div className="table-column tip-text">
            <OwnTooltip title={<React.Fragment>{t('textPositionDesc')}</React.Fragment>} arrow placement="bottom">
              <span>{t('textPosition')}</span>
            </OwnTooltip>
          </div> */}
          <div className="table-column tip-text">
            <OwnTooltip title={<React.Fragment>{t('entrustCalcClosePriceDesc')}</React.Fragment>} arrow placement="bottom">
              <span>{t('entrustCalcClosePrice')}</span>
            </OwnTooltip>
          </div>
          <div className="table-column tip-text">
            <OwnTooltip title={<React.Fragment>{t('entrustCalcProfitStopDesc')}</React.Fragment>} arrow placement="bottom">
              <span>{t('entrustCalcProfitStop')}</span>
            </OwnTooltip>
          </div>
          <div className="table-column tip-text">
            <OwnTooltip title={<React.Fragment>{t('textProfitPriceDesc')}</React.Fragment>} arrow placement="bottom">
              <span>{t('textProfitPrice')}</span>
            </OwnTooltip>
          </div>
          <div className="table-column tip-text">
            <OwnTooltip title={<React.Fragment>{t('textStopPriceDesc')}</React.Fragment>} arrow placement="bottom">
              <span>{t('textStopPrice')}</span>
            </OwnTooltip>
          </div>
          <div className="table-column">{t('textOperation')}</div>
        </div>
        )}
        {/* 持仓 body */}
        {active && type === 1 && (
          orderList.filter((item) => item.closePrice == 0).map((item, index) => {
            return (
              <div className="table-row" key={`en${index}`}>
                <div className="table-column">{item.symbol.toUpperCase()}</div>
                <div className="table-column green">{item.bsFlag == BSFLAG_LONG ? t('tradeOrderBuy') : t('tradeOrderSell')}</div>
                <div className="table-column">{item.openPrice == 0 ? t('Wait_Price') : formatPrice(item.openPrice, item.symbol)}</div>
                <div className="table-column">{Tools.fromWei(item.tokenAmount, item.decimals)} { item.openSymbol }</div>
                <div className="table-column">{item.lever} X</div>
                {/* <div className="table-column">+7182.92 USDT</div>
                <div className="table-column">88.88 USDT</div> */}
                <div className="table-column">{item.openPrice == 0 ? '--' : calcForceClosePrice(item)}</div>
                <div className="table-column">{item.openPrice == 0 ? '--' : calcOrderPL(item)} { item.openSymbol }</div>
                <div className="table-column" onClick={() => onSetTakeProfitAndStopLossClick(item)}>
                  {item.pLimitPrice != 0 ? formatPrice(item.pLimitPrice, item.symbol) : t('entrustSPPriceTip')} { item.openPrice == 0 ? (<div></div>) : (<Edit style={{ fontSize: '14px' }} />) }
                </div>
                <div className="table-column" onClick={() => onSetTakeProfitAndStopLossClick(item)}>
                  {item.lLimitPrice != 0 ? formatPrice(item.lLimitPrice, item.symbol) : t('entrustSPPriceTip')} { item.openPrice == 0 ? (<div></div>) : (<Edit style={{ fontSize: '14px' }} />) }
                </div>
                <div className="table-column">
                  <span className={item.openPrice == 0 ? 'disable-link' : 'link'} onClick={(e)=> onCloseOrderClick(item)}>{t('textClose')}</span>
                </div>
              </div>
            );
          })
        )}

        {/* 当前委托 head */}
        {active && type === 2 && (
          <div className="table-head">
          <div className="table-column">{t('contract')}</div>
          <div className="table-column">{t('textDir')}</div>

          <div className="table-column tip-text">
            <OwnTooltip title={<React.Fragment>{t('Limit_price_hint')}</React.Fragment>} arrow placement="bottom">
              <span>{t('textEntrustPrice')}</span>
            </OwnTooltip>
          </div>

          <div className="table-column">{t('textBond')}</div>
          <div className="table-column">{t('textLever')}</div>
        
          <div className="table-column tip-text">
            <OwnTooltip title={<React.Fragment>{t('textProfitPriceDesc')}</React.Fragment>} arrow placement="bottom">
              <span>{t('textProfitPrice')}</span>
            </OwnTooltip>
          </div>
          <div className="table-column tip-text">
            <OwnTooltip title={<React.Fragment>{t('textStopPriceDesc')}</React.Fragment>} arrow placement="bottom">
              <span>{t('textStopPrice')}</span>
            </OwnTooltip>
          </div>
          <div className="table-column">{t('textOperation')}</div>
        </div>
        )}
        {/* 当前委托 body */}
        {active && type === 2 && (
          limitOrderList.filter((item) => item.status == 2).map((item, index) => {
            return (
              <div className="table-row" key={`en${index}`}>
                <div className="table-column">{item.symbol.toUpperCase()}</div>
                <div className="table-column green">{item.bsFlag == BSFLAG_LONG ? t('tradeOrderBuy') : t('tradeOrderSell')}</div>
                <div className="table-column">{formatPrice(item.openPrice, item.symbol)}</div>
                <div className="table-column">{Tools.fromWei(item.tokenAmount, item.poolInfo.decimals)} { item.openSymbol }</div>
                <div className="table-column">{item.lever} X</div>
                {/* <div className="table-column" onClick={() => setVisible(true)}>
                  {item.pLimitPrice != 0 ? fromWei(item.pLimitPrice) : t('entrustSPPriceTip')} <Edit style={{ fontSize: '14px' }} />
                </div>
                <div className="table-column" onClick={() => setVisible(true)}>
                  {item.lLimitPrice != 0 ? fromWei(item.lLimitPrice) : t('entrustSPPriceTip')}  <Edit style={{ fontSize: '14px' }} />
                </div> */}
                <div className="table-column">
                  {item.pLimitPrice != 0 ? formatPrice(item.pLimitPrice, item.symbol) : t('entrustSPPriceTip')}
                </div>
                <div className="table-column">
                  {item.lLimitPrice != 0 ? formatPrice(item.lLimitPrice, item.symbol) : t('entrustSPPriceTip')}
                </div>
                <div className="table-column">
                  <span className="link" onClick={(e)=> onRevokeLimitOrderClick(item)}>{t('btnRevoke')}</span>
                </div>
              </div>
            );
          })
        )}

        {/* 历史委托 head */}
        {active && type === 3 && (
          <div className="table-head">
          <div className="table-column">{t('contract')}</div>
          <div className="table-column">{t('textDir')}</div>

          <div className="table-column tip-text">
            <OwnTooltip title={<React.Fragment>{t('Limit_price_hint')}</React.Fragment>} arrow placement="bottom">
              <span>{t('textEntrustPrice')}</span>
            </OwnTooltip>
          </div>

          <div className="table-column">{t('textBond')}</div>
          <div className="table-column">{t('textLever')}</div>
        
          <div className="table-column tip-text">
            <OwnTooltip title={<React.Fragment>{t('textProfitPriceDesc')}</React.Fragment>} arrow placement="bottom">
              <span>{t('textProfitPrice')}</span>
            </OwnTooltip>
          </div>
          <div className="table-column tip-text">
            <OwnTooltip title={<React.Fragment>{t('textStopPriceDesc')}</React.Fragment>} arrow placement="bottom">
              <span>{t('textStopPrice')}</span>
            </OwnTooltip>
          </div>
          <div className="table-column">{t('textStatus')}</div>
          <div className="table-column">{t('textTime')}</div>
        </div>
        )}
        {/* 历史委托 body */}
        {active && type === 3 && (
          limitOrderList.filter((item) => item.status == 1 || item.status == 3).map((item, index) => {
            return (
              <div className="table-row" key={`en${index}`}>
                <div className="table-column">{item.symbol.toUpperCase()}</div>
                <div className="table-column green">{item.bsFlag == BSFLAG_LONG ? t('tradeOrderBuy') : t('tradeOrderSell')}</div>
                <div className="table-column">{formatPrice(item.openPrice, item.symbol)}</div>
                <div className="table-column">{Tools.fromWei(item.tokenAmount, poolInfo.decimals)} { poolInfo.symbol }</div>
                <div className="table-column">{item.lever} X</div>
                {/* <div className="table-column" onClick={() => setVisible(true)}>
                  {item.pLimitPrice != 0 ? fromWei(item.pLimitPrice) : t('entrustSPPriceTip')} <Edit style={{ fontSize: '14px' }} />
                </div>
                <div className="table-column" onClick={() => setVisible(true)}>
                  {item.lLimitPrice != 0 ? fromWei(item.lLimitPrice) : t('entrustSPPriceTip')}  <Edit style={{ fontSize: '14px' }} />
                </div> */}
                <div className="table-column">
                  {item.pLimitPrice != 0 ? formatPrice(item.pLimitPrice, item.symbol) : t('entrustSPPriceTip')}
                </div>
                <div className="table-column">
                  {item.lLimitPrice != 0 ? formatPrice(item.lLimitPrice, item.symbol) : t('entrustSPPriceTip')}
                </div>
                <div className="table-column">{formatLimitOrderStatus(item)}</div>
                <div className="table-column">{Tools.formatTime(item.openTime)}</div>
              </div>
            );
          })
        )}

        {/* 已平仓 head */}
        {active && type === 4 && (
          <div className="table-head">
          <div className="table-column">{t('contract')}</div>
          <div className="table-column">{t('textDir')}</div>

          <div className="table-column tip-text">
            <OwnTooltip title={<React.Fragment>{t('entrustPriceDesc')}</React.Fragment>} arrow placement="bottom">
              <span>{t('entrustPrice')}</span>
            </OwnTooltip>
          </div>

          <div className="table-column tip-text">
            <OwnTooltip title={<React.Fragment>{t('Close_price_hint')}</React.Fragment>} arrow placement="bottom">
              <span>{t('textClosePrice')}</span>
            </OwnTooltip>
          </div>

          <div className="table-column">{t('textBond')}</div>
          <div className="table-column">{t('textLever')}</div>
        
          <div className="table-column tip-text">
            <OwnTooltip title={<React.Fragment>{t('textProfitPriceDesc')}</React.Fragment>} arrow placement="bottom">
              <span>{t('textProfitPrice')}</span>
            </OwnTooltip>
          </div>
          <div className="table-column tip-text">
            <OwnTooltip title={<React.Fragment>{t('textStopPriceDesc')}</React.Fragment>} arrow placement="bottom">
              <span>{t('textStopPrice')}</span>
            </OwnTooltip>
          </div>
          {/* <div className="table-column">状态</div> */}
          <div className="table-column">{t('textTime')}</div>
        </div>
        )}
        {/* 已平仓 body */}
        {active && type === 4 && (
          orderList.filter((item) => item.closePrice != 0).map((item, index) => {
            return (
              <div className="table-row" key={`en${index}`}>
                <div className="table-column">{item.symbol.toUpperCase()}</div>
                <div className="table-column green">{item.bsFlag == BSFLAG_LONG ? t('tradeOrderBuy') : t('tradeOrderSell')}</div>
                <div className="table-column">{formatPrice(item.openPrice, item.symbol)}</div>
                <div className="table-column">{formatPrice(item.openPrice, item.symbol)}</div>
                <div className="table-column">{Tools.fromWei(item.tokenAmount, item.poolInfo.decimals)} { item.openSymbol }</div>
                <div className="table-column">{item.lever} X</div>
                {/* <div className="table-column" onClick={() => setVisible(true)}>
                  {item.pLimitPrice != 0 ? fromWei(item.pLimitPrice) : t('entrustSPPriceTip')} <Edit style={{ fontSize: '14px' }} />
                </div>
                <div className="table-column" onClick={() => setVisible(true)}>
                  {item.lLimitPrice != 0 ? fromWei(item.lLimitPrice) : t('entrustSPPriceTip')}  <Edit style={{ fontSize: '14px' }} />
                </div> */}
                <div className="table-column">
                  {item.pLimitPrice != 0 ? formatPrice(item.pLimitPrice, item.symbol) : t('entrustSPPriceTip')}
                </div>
                <div className="table-column">
                  {item.lLimitPrice != 0 ? formatPrice(item.lLimitPrice, item.symbol) : t('entrustSPPriceTip')}
                </div>
                {/* <div className="table-column">状态</div> */}
                <div className="table-column">{Tools.formatTime(item.openTime)}</div>
              </div>
            );
          })
        )}
      </div>
      <OwnDialogModal onClose={() => setSetTakeProfitStopLossOrder(null)} visible={setTakeProfitStopLossOrder} title={t('modalPSTitle')}>
        <div className="stop-update-form">
          <div className="form-ele-desc">
            <label htmlFor="">{t('textProfit')}</label>
            {/* <span className="sd">
              <SwapHorizIcon style={{ fontSize: '18px', cursor: 'pointer' }} onClick={() => setProfitType(profitType === 1 ? 2 : 1)} />
              {profitType === 1 ? t('textPrice') : t('textRate')}
            </span> */}
          </div>
          <div className="form-ele-input">
            <label htmlFor="">{t('textProfitPrice')}</label>
            <input type="text" placeholder={t('textProfitPriceTip')} value={takeProfit} onChange={(e) => setTakeProfit(Tools.numFmt(e.target.value, setTakeProfitStopLossOrder.poolInfo.openDecimal))} />
            {profitType === 2 && <span className="unit">%</span>}
          </div>
          {/* <div className="form-error">*当前设置的价格将导致修改后订单立即市价成交，请注意</div> */}
          {profitType === 2 && (
            <ul className="form-list-c6">
              {profitRateList.map((item) => {
                return (
                  <li className={profitRate === item ? 'active' : ''} onClick={() => setProfitRate(item)} key={item}>
                    {item}%
                  </li>
                );
              })}
            </ul>
          )}
          <div className="form-ele-desc">
            <label htmlFor="">{t('textStop')}</label>
            {/* <span className="sd">
              <SwapHorizIcon style={{ fontSize: '18px', cursor: 'pointer' }} onClick={() => setStopType(stopType === 1 ? 2 : 1)} />
              {profitType === 1 ? t('textPrice') : t('textRate')}
            </span> */}
          </div>
          <div className="form-ele-input">
            <label htmlFor="">{t('textStopPrice')}</label>
            <input type="text" placeholder={t('textStopPriceTip')} value={stopLoss} onChange={(e) => setStopLoss(Tools(e.target.value, setTakeProfitStopLossOrder.poolInfo.openDecimal))} />
            {stopLossType === 2 && <span className="unit">%</span>}
          </div>
          {/* <div className="form-error">*当前设置的价格将导致修改后订单立即市价成交，请注意</div> */}
          {stopLossType === 2 && (
            <ul className="form-list-c6">
              {stopRateList.map((item) => {
                return (
                  <li className={stopLossRate === item ? 'active' : ''} onClick={() => setStopLossRate(item)} key={item}>
                    {item}%
                  </li>
                );
              })}
            </ul>
          )}
          <div className="form-error"></div>
          <button className="btn-primary" onClick={e=> onModifyTakeProfitAndStopLossClick()}>{t('btnConfirm')}</button>
        </div>
      </OwnDialogModal>
    </div>
  );
};

export default EntrustComponent;

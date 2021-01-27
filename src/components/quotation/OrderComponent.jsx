import React, { useState, useEffect, Fragment, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import DoubleArrowRoundedIcon from '@material-ui/icons/DoubleArrowRounded';
import SwapHorizIcon from '@material-ui/icons/SwapHoriz';
import OwnTooltip from '../tooltip/OwnTooltip';
import OwnSlider from '../slider/OwnSlider';
import Checkbox from '../checkbox/CheckBox';
import { useSelector, useDispatch } from 'react-redux';
import { useWeb3React } from '@web3-react/core';
import * as Types from '../../store/types';
import { actionPoolInfo } from '../../store/actions/ContractAction';
import './order.scss';
import PoolProxyContract from '../../common/contract/PoolProxyContract';
import PoolFactoryContract from '../../common/contract/PoolFactoryContract';
import ERC20Contract from '../../common/contract/ERC20Contract';
import TeemoPoolContract from '../../common/contract/TeemoPoolContract';
import QuoteFactoryContract from '../../common/contract/QuoteFactoryContract';
import FundContract from '../../common/contract/FundContract';
import * as Tools from '../../utils/Tools';
import { fromWei, toBN, toWei } from 'web3-utils';
import { BSFLAG_LONG, BSFLAG_SHORT, MAX_UINT256_VALUE } from '../../utils/Constants'
import { emitter } from '../../utils/event';

// 建仓类型: 市价
const OPEN_TYPE_MARKET = 2
// 建仓类型: 限价
const OPEN_TYPE_LIMIT = 1

// 止盈比例列表
const profitRateList = [25, 50, 75, 100, 150, 200];
// 止损比例列表
const stopRateList = [30, 40, 50, 60, 70, 80];

let quoteFactoryContract = null;
let poolFactoryContract = null;
let erc20Contract = null;
let poolProxyContract = null;
let fundContract = null;

const OrderComponent = (props) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const rechargeVisible = useSelector((state) => state.common.recharge.visible);
  const { poolList, poolInfo } = useSelector((state) => state.contract);
  const { productInfo } = useSelector((state) => state.trade);
  const { active, library, account, chainId } = useWeb3React();
  const orderRef = useRef();
  const [orderHeight, setOrderHeight] = useState(0);
  const [moreFlag, setMoreFlag] = useState(false);
  const [allowance, setAllowance] = useState(null);
  const [openType, setOpenType] = useState(OPEN_TYPE_MARKET); // 类型 1:限价 2:市价
  const [bsflag, setBsflag] = useState(BSFLAG_LONG); // 方向 2:涨 1:跌
  const [limitPrice, setLimitPrice] = useState(''); // 价格
  const [bond, setBond] = useState(''); // b保证金
  const [bondRate, setBondRate] = useState(''); // 保证金比例
  const [slippage, setSlippage] = useState(0.05); // 滑点比例
  const [profitType, setTakeProfitType] = useState(1); // 止盈类型
  const [takeProfit, setTakeProfit] = useState(''); // 止盈
  const [profitRate, setTakeProfitRate] = useState(''); // 止盈比例
  const [stopType, setStopType] = useState(1); // 止损类型
  const [stopLoss, setStopLoss] = useState(''); // 止损
  const [stopRate, setStopRate] = useState(''); // 止损比例
  const [fee, setFee] = useState(null); // 手续费
  const [gas, setGas] = useState(0); // gas
  const [lever, setLever] = useState(1); // 杠杆
  const [approving, setApproving] = useState(false);
  
  const [poolTotalAmount, setPoolTotalAmount] = useState(0); // 池子总量
  const [maxLever, setMaxLever] = useState(1); // 最大允许的杠杆值
  const [leverMax, setLevelMax] = useState(false); // 杠杆最大
  const [leverRate, setLevelRate] = useState(1); // 杠杆比例
  const [basicAssetBalance, setBasicAssetBalance] = useState(null); // 本位资产余额
  const [refreshDataObj, setRefreshDataObj] = useState({});

  const { quote } = useSelector((state) => {
    return state.trade;
  }); 

  function isAvailable() {
    return active && account && poolInfo && poolInfo.poolAddr;
  }

  function isTradeAvailable() {
    return isAvailable() && ((poolInfo.erc20Pool && allowance) || !poolInfo.erc20Pool);
  }

  async function getData() {
    console.log('OrderComponent getData available: ', isAvailable());
    if (!isAvailable()) {
      return Promise.error('not available');
    }
    return Promise.all([
      // 是否授权
      (poolInfo.erc20Pool ? erc20Contract.getAllowance(account, poolInfo.tokenAddr, poolInfo.poolAddr) : Promise.resolve(MAX_UINT256_VALUE)).then((res) => {
        console.log('OrderComponent setAllowance: ', res);
        setAllowance(res || 0);
        return res;
      }),
      // 查询余额
      poolProxyContract.getBalanceByPoolInfo(poolInfo, account).then((res) => {
        console.log('OrderComponent setBasicAssetBalance: ', res);
        setBasicAssetBalance(res);
        return res;
      }),
      fundContract.getPoolTotalAmount(poolInfo).then((res) => {
        console.log('OrderComponent setPoolTotalAmount: ', res);
        setPoolTotalAmount(res);
        return res;
      }),
      poolFactoryContract.getOpenFee().then((res) => {
        console.log('OrderComponent setFee: ', res);
        setFee(res);
        return res;
      }),
    ]);
  }

  const marks = [
    { value: 0, label: '1x' },
    // { value: 20, label: '20x' },
    // { value: 40, label: '40x' },
    // { value: 60, label: '60x' },
    // { value: 80, label: '80x' },
    { value: 100, label: `${maxLever}x` },
  ];

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
    emitter.on('refreshBalance', async () => { 
      console.log('OrderComponent refreshBalance', active, account , poolInfo, poolInfo.poolAddr);
      getDataFunc();
      setRefreshDataObj({});
    });
  }, [])

  useEffect(() => {
    setLimitPrice('');
    setTakeProfit('');
    setStopLoss('');
  }, [productInfo])

  useEffect(() => {
    getDataFunc();
  }, [refreshDataObj])

  useEffect(() => {
    setLimitPrice('');
  }, [openType])

  useEffect(() => {
    var l = 100;
    if (bond != 0) {
      if (poolTotalAmount && poolTotalAmount != 0) {
        l = Math.floor(Tools.fromWei(poolTotalAmount, poolInfo.decimals) / 2 / bond);
        if (l > 100) {
          l = 100;
        }
        if (l < 1) {
          l = 1;
        }
      } else {
        l = 1;
      }
    } else {
      l = 100;
    }
    setMaxLever(l);
    if (lever > l) {
      setLever(l);
    }
  }, [bond, poolTotalAmount])

  useEffect(async () => {
    if (active && account && poolInfo.poolAddr) {
      console.log('poolInfo: ', poolInfo);
      quoteFactoryContract = new QuoteFactoryContract(library, chainId, account);
      erc20Contract = new ERC20Contract(library, chainId, account);
      poolProxyContract = new PoolProxyContract(library, chainId, account);
      fundContract = new FundContract(library, chainId, account);
      poolFactoryContract = new PoolFactoryContract(library, chainId, account);

      getDataFunc();
    } else {
      quoteFactoryContract = null;
      poolProxyContract = null;
      erc20Contract = null;
      fundContract = null;
      setBasicAssetBalance(null)
      setAllowance(null);
    }
  }, [active, library, account, poolInfo]);

  useEffect(() => {
    // 设置列表高度
    setOrderHeight(() => orderRef.current.clientHeight);
  }, []);

  // 池子切换
  function switchPoolInfo(symbol) {
    let obj = poolList.find((item) => item.symbol === symbol);
    actionPoolInfo(obj)(dispatch);
  }

  const onBondRateClick = (rate) => {
    //rate / 100.0
    setBondRate(rate);
    if (basicAssetBalance) {
      setBond(Tools.numFmt(Tools.fromWei(Tools.mul(basicAssetBalance, rate / 100.0), poolInfo.decimals), poolInfo.openDecimal));
    }
  }

  const onBondInputChanged = (bond) => {
    setBond(Tools.numFmt(bond, poolInfo.openDecimal));
  }

  const onLeverInputChanged = (lever) => {
    if (leverMax) return;
    let fixedLever = parseInt(lever);
    if (isNaN(fixedLever)) {
      fixedLever = 1;
    }
    if (fixedLever > maxLever) {
      fixedLever = maxLever;            
    }
    if (fixedLever < 1) {
      fixedLever = 1;            
    }
    setLever(fixedLever);
    if (fixedLever < maxLever) {
      setLevelMax(fixedLever == maxLever);
    }
    setLevelRate((fixedLever * 1.0 / maxLever) * 100);
  }

  const onLeverRateClick = (rate) => {
    onLeverInputChanged(parseInt(maxLever * (rate / 100.0)));
    if (rate == 0) {
      setLevelRate(rate);
    }
  }

  const onLevelMaxClick = (checked) => {
    setLevelMax(checked);
    if (checked) {
      setLever(maxLever);
    }
  }

  // 授权
  function approveToPool() {
    if (!erc20Contract || approving) return;
    erc20Contract
    .approve(account, poolInfo.tokenAddr, poolInfo.poolAddr)      
    .on('error', function (error) {})
    .on('transactionHash', function (hash) {
      setApproving(true);
      console.log('approve transactionHash: ', hash);
    })
    .on('receipt', (receipt) => {
      setApproving(false);
      setAllowance(MAX_UINT256_VALUE);
      console.log('approve receipt: ', receipt);
    });
  }

  // 下单
  const createOrder = async () => {
    if (!isTradeAvailable()) return;
    if (!bond || bond === '') {
      alert(t('Margin_hint'));
      return;
    }
    if (openType === OPEN_TYPE_LIMIT && (!limitPrice || limitPrice === '')) {
      alert(t('limitPricePlaceholder'));
      return;
    }
    if (!quote || !quote.close) return;
    let newPrice = toWei(quote.close.toString());
    let fixedTakeProfit = 0;
    let fixedStopLoss = 0;
    //开启高级设置 moreFlag
    if (moreFlag) {
      fixedTakeProfit = toWei((takeProfit || 0).toString());
      fixedStopLoss = toWei((stopLoss || 0).toString());
    }
    let symbol = productInfo.pair;
    let fixedLever = parseInt(lever);

    var res;
    try {
      res = await Promise.all([
        fundContract.getPoolTotalAmount(poolInfo).then((res) => {
          console.log('OrderComponent setPoolTotalAmount: ', res);
          setPoolTotalAmount(res);
          return res;
        }),
        // quoteFactoryContract.getNewPrice(symbol).then((res) => {
        //   console.log('quote: ', res);
        //   return res;
        // }),
        // poolProxyContract.getBalanceByPoolInfo(poolInfo, account).then((res) => {
        //   console.log('OrderComponent setBasicAssetBalance: ', res);
        //   setBasicAssetBalance(res);
        //   return res;
        // }),
      ]);
    } catch(e) {
      console.log(e);
      return;
    }

    var poolTotalAmount = res[0];
    //var quote = res[1];
    //let newPrice = quote.newPrice;

    var formatPoolTotalAmount = Tools.fromWei(poolTotalAmount, poolInfo.decimals);
    var totalAmount = formatPoolTotalAmount / 2;

    if (bond * fixedLever > totalAmount) {
      if (fixedLever > 1) {
        alert(t('Leverage_err', { p: maxLever }));
        return;
      }
      alert(t('Margin_err', { p: totalAmount, token: poolInfo.symbol }));
      return;
    }
    var tokenAmount = Tools.toWei(bond.toString(), poolInfo.decimals);

    //TODO 校验余额
    if (openType == OPEN_TYPE_MARKET) {
      let maxPrice = newPrice;
      if (bsflag == BSFLAG_LONG) {
        //校验止盈价
        if (takeProfit && Tools.GE(maxPrice, fixedTakeProfit)) {
          return alert(t('takeProfitLTHint') + fromWei(maxPrice));
        }
        //校验止损价
        if (stopLoss && Tools.LE(maxPrice, fixedStopLoss)) {
          return alert(t('takeLossGTHint') + fromWei(maxPrice));
        }
        maxPrice = toWei((fromWei(maxPrice) * (1 + slippage)).toString());
      } else {
        //校验止盈价
        if (takeProfit && Tools.GE(fixedTakeProfit, maxPrice)) {
          return alert(t('takeProfitGTHint') + fromWei(maxPrice));
        }
        //校验止损价
        if (stopLoss && Tools.LE(fixedStopLoss, maxPrice)) {
          return alert(t('stopLossLTHint') + fromWei(maxPrice));
        }
        maxPrice = toWei((fromWei(maxPrice) * (1 - slippage)).toString());
      }
      var teemoPoolContract = new TeemoPoolContract(library, chainId, account);
      teemoPoolContract.openMarketSwap(poolInfo, symbol, tokenAmount, fixedLever, bsflag, fixedTakeProfit, fixedStopLoss, maxPrice)
      .on('transactionHash', function (hash) {
      })
      .on('receipt', async (receipt) => {
        emitter.emit('refreshOrder');
        console.log('市价建仓成功');
        await getData();
      });
    } else {
      var openPrice = toWei(limitPrice.toString());
      if (bsflag == BSFLAG_LONG) {
        //校验止盈价
        if (takeProfit && Tools.GE(openPrice, fixedTakeProfit)) {
          return alert(t('takeProfitLTHint') + takeProfit);
        }
        //校验止损价
        if (stopLoss && Tools.LE(openPrice, fixedStopLoss)) {
          return alert(t('takeLossGTHint') + stopLoss);
        }
      } else {
        //校验止盈价
        if (takeProfit && Tools.GE(fixedTakeProfit, openPrice)) {
          return alert(t('takeProfitGTHint') + takeProfit);
        }
        //校验止损价
        if (stopLoss && Tools.LE(fixedStopLoss, openPrice)) {
          return alert(t('stopLossLTHint') + stopLoss);
        }
      }
      var teemoPoolContract = new TeemoPoolContract(library, chainId, account);
      teemoPoolContract.openLimitSwap(poolInfo, symbol, newPrice, openPrice, tokenAmount, fixedLever, bsflag, fixedTakeProfit, fixedStopLoss)
      .on('transactionHash', function (hash) {
      })
      .on('receipt', async (receipt) => {
        emitter.emit('refreshOrder');
        console.log('限价建仓成功');
        await getData();
      });
    }
  }

  return (
    <div className="order" ref={orderRef}>
      <div className="order-box" style={{ height: `${orderHeight}px` }}>
        <div className="btn-box">
          <button className={`btn-default ${bsflag === BSFLAG_LONG ? 'bg-green' : ''}`} onClick={() => setBsflag(BSFLAG_LONG)}>
            {t('tradeOrderBuy')}
          </button>
          <button className={`btn-default ${bsflag === BSFLAG_SHORT ? 'bg-red' : ''}`} onClick={() => setBsflag(BSFLAG_SHORT)}>
            {t('tradeOrderSell')}
          </button>
        </div>

        <div className="form-ele-desc">
          <label htmlFor="">{t('walletName')}</label>
          <span className="sd">
            {account ? `${account.substring(0, 6)}…${account.substring(account.length, account.length - 4)}` : '--'}
            {/* <OwnTooltip title={<React.Fragment>需充进Layer2中才可进行交易Layer2上交易更快,gas更低</React.Fragment>} arrow placement="bottom">
              <font className="tip-text">(Layer2)</font>
            </OwnTooltip> */}
          </span>
        </div>

        <div className="form-ele-sl">
          <label htmlFor="">{t('orderPaymentLabel')}</label>
          <span></span>
          <select value={poolInfo.symbol} onChange={(e) => switchPoolInfo(e.target.value)}>
            {poolList.map((item) => {
              return <option key={item.symbol} value={item.symbol}>{item.symbol}</option>;
            })}
          </select>
        </div>

        {/* <div className="form-ele-desc">
          <label htmlFor="">
            可用
            <OwnTooltip title={<React.Fragment>需充进Layer2中才可进行交易Layer2上交易更快,gas更低</React.Fragment>} arrow placement="bottom">
              <font className="tip-text">(Layer2)</font>
            </OwnTooltip>
          </label>
          <span className="sd">{balance}</span>
          <font className="recharge-btn" onClick={() => dispatch({ type: Types.RECHARGE_VISIBLE, payload: { visible: !rechargeVisible } })}>
            充值
          </font>
        </div> */}

        <div className="form-ele-desc">
          <label htmlFor="">{t('textAvailable')}</label>
          <span className="sd">{basicAssetBalance ? Tools.fromWei(basicAssetBalance, poolInfo.decimals) : '--'}</span>
        </div>

        <div className="form-ele-select">
          <select value={openType} onChange={(e) => setOpenType(parseInt(e.target.value))}>
            <option value={OPEN_TYPE_MARKET}>{t('orderMarket')}</option>
            <option value={OPEN_TYPE_LIMIT}>{t('orderLimit')}</option>
          </select>
        </div>

        <div className={openType === OPEN_TYPE_MARKET ? 'form-ele-disable' : 'form-ele-input'}>
          <label htmlFor="">{t('textPrice')}</label>
          <input type="text" value={limitPrice} onChange={(e) => setLimitPrice(Tools.numFmt(e.target.value, productInfo.decimal))} placeholder={openType === OPEN_TYPE_MARKET ? t('orderMarketPricePlaceholder') : t('limitPricePlaceholder')} disabled={openType === OPEN_TYPE_MARKET} />
        </div>

        <div className="form-ele-input">
          <label htmlFor="">{t('textBond')}</label>
          <input type="text" value={bond} onChange={(e) => onBondInputChanged(e.target.value) } placeholder="" />
        </div>

        <ul className="form-list-c4">
          <li className={bondRate === 10 ? 'active' : ''} onClick={() => onBondRateClick(10)}>
            10%
          </li>
          <li className={bondRate === 20 ? 'active' : ''} onClick={() => onBondRateClick(20)}>
            20%
          </li>
          <li className={bondRate === 50 ? 'active' : ''} onClick={() => onBondRateClick(50)}>
            50%
          </li>
          <li className={bondRate === 100 ? 'active' : ''} onClick={() => onBondRateClick(100)}>
            100%
          </li>
        </ul>

        <div className="form-ele-input">
          <label htmlFor="">{t('textLever')}</label>
          <input type="text" value={lever} onChange={(e) => onLeverInputChanged(e.target.value)} />
          <span className="unit" style={{ color: '#f4f9ff' }}>
            x
          </span>
        </div>

        <div className="form-slider">
          <OwnSlider disabled={leverMax} value={leverRate} onChange={(e, val) => onLeverRateClick(val)} step={10} marks={marks} />
        </div>

        <div className="form-ele-desc">
          <label htmlFor="">
            <OwnTooltip title={<React.Fragment>{t('maxLeverResizeHint')}</React.Fragment>} arrow placement="bottom">
              <font className="tip-text">{t('orderLeverDesc')}</font>
            </OwnTooltip>
            {maxLever}x
          </label>
          <OwnTooltip title={<React.Fragment>{t('maxLeverCreateOrderHint')}</React.Fragment>} arrow placement="bottom-end">
            <span className="sd tip-text">
              <Checkbox size="small" checked={leverMax} onChange={(e) => onLevelMaxClick(e.target.checked) } />
              {t('orderLeverBtn')}
            </span>
          </OwnTooltip>
        </div>

        <div className="form-ele-more">
          <div className="more-title">
            <label htmlFor="">{t('orderSenior')}</label>
            <span onClick={() => setMoreFlag(!moreFlag)}>
              <DoubleArrowRoundedIcon className={moreFlag ? 'svgup' : 'svgdown'} />
            </span>
          </div>

          {moreFlag && (
            <Fragment>
              <div className="hide">
                <div className="form-ele-desc">
                  <label htmlFor="">{t('textProfit')}</label>
                  {/* <span className="sd">
                    <SwapHorizIcon style={{ fontSize: '18px', cursor: 'pointer' }} onClick={() => setTakeProfitType(profitType === 1 ? 2 : 1)} />
                    {profitType === 1 ? t('textPrice') : t('textRate')}
                  </span> */}
                </div>
                <div className="form-ele-input">
                  <label htmlFor="">{t('textProfitPrice')}</label>
                  <input type="text" placeholder={t('textProfitPriceTip')} value={takeProfit} onChange={(e) => setTakeProfit(Tools.numFmt(e.target.value, productInfo.decimal))} />
                  {profitType === 2 && <span className="unit">%</span>}
                </div>
                {profitType === 2 && (
                  <ul className="form-list-c6">
                    {profitRateList.map((item) => {
                      return (
                        <li className={profitRate === item ? 'active' : ''} onClick={() => setTakeProfitRate(item)} key={item}>
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
                  <input type="text" placeholder={t('textStopPriceTip')} value={stopLoss} onChange={(e) => setStopLoss(Tools.numFmt(e.target.value, productInfo.decimal))} />
                  {stopType === 2 && <span className="unit">%</span>}
                </div>
                {stopType === 2 && (
                  <ul className="form-list-c6">
                    {stopRateList.map((item) => {
                      return (
                        <li className={stopRate === item ? 'active' : ''} onClick={() => setStopRate(item)} key={item}>
                          {item}%
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
              <div className="form-ele-desc">
                <OwnTooltip title={<React.Fragment>{t('orderWaveHint')}</React.Fragment>} arrow placement="bottom">
                  <label htmlFor="" className="tip-text">
                    {t('orderWaveLabel')}
                  </label>
                </OwnTooltip>
                <span className="sd"></span>
              </div>
              <ul className="form-list-c3">
                <li className={slippage == 0.05 ? "active" : ''} onClick={() => setSlippage(0.05)}>0.5%</li>
                <li className={slippage == 0.1 ? "active" : ''} onClick={() => setSlippage(0.1)}>1%</li>
                <li className={slippage == 0.3 ? "active" : ''} onClick={() => setSlippage(0.3)}>3%</li>
                {/* <li>定制</li> */}
              </ul>
            </Fragment>
          )}
        </div>

        <div className="form-ele-desc">
          <OwnTooltip title={<React.Fragment>Teemo不收取交易手续费</React.Fragment>} arrow placement="bottom">
            <label htmlFor="" className="tip-text">
              {t('orderFee')}
            </label>
          </OwnTooltip>
          <span className="sd">{fee ? Tools.toStringAsFixed(fromWei(fee), 2) : '--'}</span>
        </div>
{/* 
        <div className="form-ele-desc">
          <OwnTooltip title={<React.Fragment>GAS Price: 3 GWEI</React.Fragment>} arrow placement="bottom">
            <label htmlFor="" className="tip-text">
              GAS(ETH)
            </label>
          </OwnTooltip>
          <span className="sd">{gas}</span>
        </div>

        <ul className="form-list-c3 mb24">
          <li className={lever === 1 ? 'active' : ''} onClick={() => setLever(1)}>
            Safe
          </li>
          <li className={lever === 2 ? 'active' : ''} onClick={() => setLever(2)}>
            Standard
          </li>
          <li className={lever === 3 ? 'active' : ''} onClick={() => setLever(3)}>
            Fast
          </li>
        </ul> */}
        {
          isTradeAvailable() ? (Tools.GT(allowance || 0, 0) ? (
            <button className={`btn-default ${bsflag === BSFLAG_LONG ? 'bg-green' : 'bg-red'}`} style={{ width: '100%' }} onClick={() => createOrder()}>
              {bsflag === 2 ? t('tradeOrderBuy') : t('tradeOrderSell')}
            </button>
          ) : (
            <button className={`btn-default ${bsflag === BSFLAG_LONG ? 'bg-green' : 'bg-red'}`} style={{ width: '100%' }} onClick={() => approveToPool()}>
              { approving ? t('btnAuthing') : `${t('btnAuth')}${poolInfo.symbol}`}
            </button>
          )) : (<span></span>)
        }
      </div>
    </div>
  );
};

export default OrderComponent;

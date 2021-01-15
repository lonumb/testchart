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
import TeemoContract from '../../common/contract/TeemoContract';
import PoolProxyContract from '../../common/contract/PoolProxyContract';
import ERC20Contract from '../../common/contract/ERC20Contract';
import TeemoPoolContract from '../../common/contract/TeemoPoolContract';
import QuoteFactoryContract from '../../common/contract/QuoteFactoryContract';
import QuoteContract from '../../common/contract/QuoteContract';
import * as Tools from '../../utils/Tools';
import chainConfig from '../../components/wallet/Config'
import { getConfigByChainID } from '../../utils/Config'
import { fromWei, toBN, toWei } from 'web3-utils';
import { BUY_DIR_LONG, BUY_DIR_SHORT, MAX_UINT256_VALUE } from '../../utils/Constants'

// 建仓类型: 市价
const OPEN_TYPE_MARKET = 2
// 建仓类型: 限价
const OPEN_TYPE_LIMIT = 1

const marks = [
  { value: 0, label: '1x' },
  { value: 20, label: '20x' },
  { value: 40, label: '40x' },
  { value: 60, label: '60x' },
  { value: 80, label: '80x' },
  { value: 100, label: '100x' },
];

// 止盈比例列表
const profitRateList = [25, 50, 75, 100, 150, 200];
// 止损比例列表
const stopRateList = [30, 40, 50, 60, 70, 80];

let tokenContract = null;
let poolProxyContract = null;

const OrderComponent = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const rechargeVisible = useSelector((state) => state.common.recharge.visible);
  const { poolList, poolInfo } = useSelector((state) => state.contract);
  const { active, library, account, chainId } = useWeb3React();
  const orderRef = useRef();
  const [orderHeight, setOrderHeight] = useState(0);
  const [moreFlag, setMoreFlag] = useState(false);
  const [allowance, setAllowance] = useState(null);
  const [openType, setOpenType] = useState(OPEN_TYPE_MARKET); // 类型 1:限价 2:市价
  const [dir, setDir] = useState(BUY_DIR_LONG); // 方向 2:涨 1:跌
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
  const [fee, setFee] = useState(0); // 手续费
  const [gas, setGas] = useState(0); // gas
  const [lever, setLever] = useState(1); // 杠杆
  const [maxLever, setMaxLever] = useState(100); // 最大允许的杠杆值
  const [leverMax, setLevelMax] = useState(false); // 杠杆最大
  const [leverRate, setLevelRate] = useState(1); // 杠杆比例
  const [basicAssetBalance, setBasicAssetBalance] = useState(null); // 本位资产余额

  function isAvailable() {
    return active && account && poolInfo && poolInfo.poolAddr;
  }

  function isTradeAvailable() {
    return isAvailable() && ((poolInfo.erc20Pool && allowance) || !poolInfo.erc20Pool);
  }

  async function getData() {
    console.log('getData available: ', isAvailable());
    if (!isAvailable()) {
      return Promise.error('not available');
    }
    return Promise.all([
      // 是否授权
      (poolInfo.erc20Pool ? tokenContract.getAllowance(account, poolInfo.tokenAddr) : Promise.resolve(MAX_UINT256_VALUE)).then((res) => {
        console.log('setAllowance: ', res);
        setAllowance(res || 0);
      }),
      // 查询余额
      poolProxyContract.getBalanceByPoolInfo(poolInfo, account).then((res) => {
        console.log('setBasicAssetBalance: ', res);
        setBasicAssetBalance(res);
      }),
    ]);
  }

  // useEffect(() => {
  //   console.log(bondRate);
  // }, [bondRate]);

  //console.log(`active: ${active}`);
  useEffect(async () => {
    if (active && account && poolInfo.symbol) {
      console.log('poolInfo: ', poolInfo);
      tokenContract = new ERC20Contract(library, chainId, account);
      poolProxyContract = new PoolProxyContract(library, chainId, account);

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

      getDataFunc();

      // // 是否授权
      // tokenContract.getAllowance(account, poolInfo.tokenAddr).then((res) => {
      //   console.log('setAllowance: ', res);
      //   setAllowance(res || 0);
      // });
      // // 查询余额
      // poolProxyContract.getBalanceByPoolInfo(poolInfo, account).then((res) => {
      //   console.log('setBasicAssetBalance: ', res);
      //   setBasicAssetBalance(res);
      // });

      //let teemoPoolContract = new TeemoContract(library, poolInfo.tokenAddr);
      //commonContract = new CommonContract(library, chainId || chainConfig.defaultChainId);
      // let quoteContract = new QuoteContract(library, chainId || chainConfig.defaultChainId);
      // quoteContract.queryNewPrice(poolInfo.symbol).then((res) => {
      //   console.log('queryNewPrice', res);
      // });
      // 查询余额
      // commonContract.getBalanceOf(account, poolInfo.tokenAddr).then((res) => {
      //   setBalance(res || 0);
      // });

      // 是否授权
      // commonContract.getAllowance(account, poolInfo.tokenAddr).then((res) => {
      //   setAllowance(res || 0);
      // });
    } else {
      poolProxyContract = null;
      tokenContract = null;
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
      setBond(fromWei(Tools.mul(basicAssetBalance, rate / 100.0)));
    }
  }

  const onLeverClick = (lever) => {
    let targetLever = parseInt(lever);
    if (isNaN(targetLever)) {
      targetLever = 1;
    }
    if (targetLever < 1) {
      targetLever = 1;      
    }
    if (targetLever > maxLever) {
      targetLever = maxLever;            
    }
    setLever(targetLever);
    if (targetLever < maxLever) {
      setLevelMax(targetLever == maxLever);
    }
    setLevelRate((targetLever * 1.0 / maxLever) * 100);
  }

  const onLeverRateClick = (rate) => {
    //rate / 100.0
    setLever(parseInt(maxLever * (rate / 100.0)));
    setLevelRate(rate);
  }

  const onLevelMaxClick = (checked) => {
    setLevelMax(checked);
    if (checked) {
      setLever(maxLever);
    }
  }

  // 授权
  function approveToPool() {
    if (!tokenContract) return;
    tokenContract
    .approve(account, poolInfo.tokenAddr)      
    .on('error', function (error) {})
    .on('transactionHash', function (hash) {
      console.log('approve transactionHash: ', hash);
    })
    .on('receipt', (receipt) => {
      setAllowance(MAX_UINT256_VALUE);
      console.log('approve receipt: ', receipt);
    });
  }

  // 下单
  const createOrder = async () => {
    if (!isTradeAvailable()) return;
    if (!bond || bond === '') {
      alert('请输入保证金');
      return;
    }
    if (isNaN(parseFloat(bond))) {
      alert('请输入正确的保证金');
      return;
    }
    if (openType === OPEN_TYPE_LIMIT) {
      if (!limitPrice || limitPrice === '') {
        alert('请输入价格');
        return;
      }
      if (isNaN(parseInt(limitPrice))) {
        alert('请输入正确的价格');
        return;
      }
    }
    if (!lever || isNaN(parseInt(lever)) || parseInt(lever < 1)) {
      alert('请输入正确的杠杆');
      return;
    }
    //开启高级设置 moreFlag
    if (moreFlag) {
      if (!takeProfit || takeProfit === '') {
        alert('请输入止盈价');
        return;
      }
      if (isNaN(parseInt(takeProfit))) {
        alert('请输入正确的止盈价');
        return;
      }
      if (!stopLoss || stopLoss === '') {
        alert('请输入止盈价');
        return;
      }
      if (isNaN(parseInt(stopLoss))) {
        alert('请输入正确的止盈价');
        return;
      }
    }
    let symbol = 'btc/usdt';
    
    if (openType == OPEN_TYPE_MARKET) {
      let maxPrice;
      try {
        let quoteFactoryContract = new QuoteFactoryContract(library, chainId, account);
        let quote = await quoteFactoryContract.getNewPrice(symbol);
        console.log('quote: ', quote);
        maxPrice = quote.newPrice;
      } catch(e) {
        console.log(e);
        return;
      }
      if (dir == BUY_DIR_LONG) {
        maxPrice = Tools.mul(maxPrice, 1 + slippage);
      } else {
        maxPrice = Tools.mul(maxPrice, 1 - slippage);
      }
      var amount = parseFloat(bond);
      var tokenAmount = toWei(amount.toString());
      var teemoPoolContract = new TeemoPoolContract(library, chainId, account);
      teemoPoolContract.openMarketSwap(poolInfo, symbol, tokenAmount, parseInt(lever), dir, 0, 0, maxPrice)
      .on('transactionHash', function (hash) {
        console.log('openMarketSwap transactionHash: ', hash);
      })
      .on('receipt', async (receipt) => {
        alert('市价建仓成功');
        await getData();
      });
    } else {
      var amount = parseFloat(bond);
      var tokenAmount = toWei(amount.toString());

      var price = parseFloat(limitPrice);
      var openPrice = toWei(price.toString());
      var teemoPoolContract = new TeemoPoolContract(library, chainId, account);
      teemoPoolContract.openLimitSwap(poolInfo, symbol, openPrice, tokenAmount, parseInt(lever), dir, 0, 0)
      .on('transactionHash', function (hash) {
        console.log('openMarketSwap transactionHash: ', hash);
      })
      .on('receipt', async (receipt) => {
        alert('限价建仓成功');
        await getData();
      });
    }
  }

  return (
    <div className="order" ref={orderRef}>
      <div className="order-box" style={{ height: `${orderHeight}px` }}>
        <div className="btn-box">
          <button className={`btn-default ${dir === BUY_DIR_LONG ? 'bg-green' : ''}`} onClick={() => setDir(BUY_DIR_LONG)}>
            买涨
          </button>
          <button className={`btn-default ${dir === BUY_DIR_SHORT ? 'bg-red' : ''}`} onClick={() => setDir(BUY_DIR_SHORT)}>
            买跌
          </button>
        </div>

        <div className="form-ele-desc">
          <label htmlFor="">钱包</label>
          <span className="sd">
            {account ? `${account.substring(0, 6)}…${account.substring(account.length, account.length - 4)}` : '--'}
            {/* <OwnTooltip title={<React.Fragment>需充进Layer2中才可进行交易Layer2上交易更快,gas更低</React.Fragment>} arrow placement="bottom">
              <font className="tip-text">(Layer2)</font>
            </OwnTooltip> */}
          </span>
        </div>

        <div className="form-ele-sl">
          <label htmlFor="">支付Token</label>
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
          <label htmlFor="">可用</label>
          <span className="sd">{basicAssetBalance ? fromWei(basicAssetBalance) : '--'}</span>
        </div>

        <div className="form-ele-select">
          <select value={openType} onChange={(e) => setOpenType(parseInt(e.target.value))}>
            <option value={OPEN_TYPE_MARKET}>市价委托</option>
            <option value={OPEN_TYPE_LIMIT}>限价委托</option>
          </select>
        </div>

        <div className={openType === OPEN_TYPE_MARKET ? 'form-ele-disable' : 'form-ele-input'}>
          <label htmlFor="">价格</label>
          <input type="text" value={limitPrice} onChange={(e) => setLimitPrice(e.target.value)} placeholder={openType === OPEN_TYPE_MARKET ? '最优市场价' : '请输入价格'} disabled={openType === OPEN_TYPE_MARKET} />
        </div>

        <div className="form-ele-input">
          <label htmlFor="">保证金</label>
          <input type="text" value={bond} onChange={(e) => setBond(e.target.value)} placeholder="最小为2USDT" />
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
          <label htmlFor="">杠杆</label>
          <input type="text" value={lever} onChange={(e) => onLeverClick(e.target.value)} />
          <span className="unit" style={{ color: '#f4f9ff' }}>
            x
          </span>
        </div>

        <div className="form-slider">
          <OwnSlider disabled={leverMax} value={leverRate} onChange={(e, val) => onLeverRateClick(val)} step={10} marks={marks} />
        </div>

        <div className="form-ele-desc">
          <label htmlFor="">
            <OwnTooltip title={<React.Fragment>可用最大杠杆根据当前资金池深度以及头寸动态调整</React.Fragment>} arrow placement="bottom">
              <font className="tip-text">当前可用最大杠杆:</font>
            </OwnTooltip>
            {maxLever}x
          </label>
          <OwnTooltip title={<React.Fragment>根据建仓时可用的最大杠杆建仓</React.Fragment>} arrow placement="bottom-end">
            <span className="sd tip-text">
              <Checkbox size="small" checked={leverMax} onChange={(e) => onLevelMaxClick(e.target.checked) } />
              最大
            </span>
          </OwnTooltip>
        </div>

        <div className="form-ele-more">
          <div className="more-title">
            <label htmlFor="">高级</label>
            <span onClick={() => setMoreFlag(!moreFlag)}>
              <DoubleArrowRoundedIcon className={moreFlag ? 'svgup' : 'svgdown'} />
            </span>
          </div>

          {moreFlag && (
            <Fragment>
              <div className="form-ele-desc">
                <label htmlFor="">止盈</label>
                <span className="sd">
                  <SwapHorizIcon style={{ fontSize: '18px', cursor: 'pointer' }} onClick={() => setTakeProfitType(profitType === 1 ? 2 : 1)} />
                  {profitType === 1 ? '价格' : '比例'}
                </span>
              </div>
              <div className="form-ele-input">
                <label htmlFor="">止盈价</label>
                <input type="text" placeholder="输入止盈价" value={takeProfit} onChange={(e) => setTakeProfit(e.target.value)} />
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
                <label htmlFor="">止损</label>
                <span className="sd">
                  <SwapHorizIcon style={{ fontSize: '18px', cursor: 'pointer' }} onClick={() => setStopType(stopType === 1 ? 2 : 1)} />
                  {profitType === 1 ? '价格' : '比例'}
                </span>
              </div>
              <div className="form-ele-input">
                <label htmlFor="">止损价</label>
                <input type="text" placeholder="输入止损价" value={stopLoss} onChange={(e) => setStopLoss(e.target.value)} />
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
              <div className="form-ele-desc">
                <OwnTooltip title={<React.Fragment>因下单时间和实际成交时间导致的价格滑点,不可避免</React.Fragment>} arrow placement="bottom">
                  <label htmlFor="" className="tip-text">
                    最高滑价
                  </label>
                </OwnTooltip>
                <span className="sd"></span>
              </div>
              <ul className="form-list-c3">
                <li className={slippage == 0.05 ? "active" : ''} onClick={() => setSlippage(0.05)}>0.5%</li>
                <li className={slippage == 0.1 ? "active" : ''} onClick={() => setSlippage(0.1)}>1%</li>
                <li className={slippage == 0.15 ? "active" : ''} onClick={() => setSlippage(0.15)}>1.5%</li>
                {/* <li>定制</li> */}
              </ul>
            </Fragment>
          )}
        </div>

        {/* <div className="form-ele-desc">
          <OwnTooltip title={<React.Fragment>Teemo不收取交易手续费</React.Fragment>} arrow placement="bottom">
            <label htmlFor="" className="tip-text">
              手续费
            </label>
          </OwnTooltip>
          <span className="sd">{fee}</span>
        </div>

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
            <button className={`btn-default ${dir === BUY_DIR_LONG ? 'bg-green' : 'bg-red'}`} style={{ width: '100%' }} onClick={() => createOrder()}>
              {dir === 2 ? '买涨' : '买跌'}
            </button>
          ) : (
            <button className={`btn-default ${dir === BUY_DIR_LONG ? 'bg-green' : 'bg-red'}`} style={{ width: '100%' }} onClick={() => approveToPool()}>
              授权USDT
            </button>
          )) : (<span></span>)
        }
      </div>
    </div>
  );
};

export default OrderComponent;

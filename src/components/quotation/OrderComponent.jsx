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
import CommonContract from '../../common/contract/CommonContract';
import PoolProxyContract from '../../common/contract/PoolProxyContract';
import QuoteContract from '../../common/contract/QuoteContract';
import * as Tools from '../../utils/Tools';
import chainConfig from '../../components/wallet/Config'
import { getConfigByChainID } from '../../utils/Config'
import { fromWei } from 'web3-utils';

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

let poolProxyContract = null;
let commonContract = null;

const OrderComponent = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const rechargeVisible = useSelector((state) => state.common.recharge.visible);
  const { poolList, poolInfo } = useSelector((state) => state.contract);
  const { active, library, account, chainId } = useWeb3React();
  const orderRef = useRef();
  const [orderHeight, setOrderHeight] = useState(0);
  const [balance, setBalance] = useState(0); // 余额
  const [moreFlag, setMoreFlag] = useState(false);
  const [allowance, setAllowance] = useState(0);

  const [type, setType] = useState(2); // 类型 1:现价 2:市价
  const [dir, setDir] = useState(1); // 方向 2:涨 1:跌
  const [price, setPrice] = useState(''); // 价格
  const [bond, setBond] = useState(''); // b保证金
  const [bondRate, setBondRate] = useState(''); // 保证金比例
  const [profitType, setProfitType] = useState(1); // 止盈类型
  const [profit, setProfit] = useState(''); // 止盈
  const [profitRate, setProfitRate] = useState(''); // 止盈比例
  const [stopType, setStopType] = useState(1); // 止损类型
  const [stop, setStop] = useState(''); // 止损
  const [stopRate, setStopRate] = useState(''); // 止损比例
  const [fee, setFee] = useState(0); // 手续费
  const [gas, setGas] = useState(0); // gas
  const [level, setLevel] = useState(1); // 杠杆
  const [levelMax, setLevelMax] = useState(false); // 杠杆最大
  const [levelRate, setLevelRate] = useState(1); // 杠杆比例
  const [basicAssetBalance, setBasicAssetBalance] = useState(null); // 本位资产余额

  //console.log(`active: ${active}`);
  useEffect(() => {
    if (active && account && poolInfo) {
      poolProxyContract = new PoolProxyContract(library, poolInfo.tokenAddr, account);
      poolProxyContract.getBalanceByPoolInfo(poolInfo, account).then((res) => {

      });

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
      setBasicAssetBalance(null)
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

  // 授权
  function gainAllowance() {
    commonContract.approve(account, poolInfo.tokenAddr);
  }

  return (
    <div className="order" ref={orderRef}>
      <div className="order-box" style={{ height: `${orderHeight}px` }}>
        <div className="btn-box">
          <button className={`btn-default ${dir === 1 ? 'bg-green' : ''}`} onClick={() => setDir(1)}>
            买涨
          </button>
          <button className={`btn-default ${dir === 2 ? 'bg-red' : ''}`} onClick={() => setDir(2)}>
            买跌
          </button>
        </div>

        <div className="form-ele-desc">
          <label htmlFor="">钱包</label>
          <span className="sd">
            {account ? `${account.substring(0, 6)}…${account.substring(account.length, account.length - 4)}` : ''}
            <OwnTooltip title={<React.Fragment>需充进Layer2中才可进行交易Layer2上交易更快,gas更低</React.Fragment>} arrow placement="bottom">
              <font className="tip-text">(Layer2)</font>
            </OwnTooltip>
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
          <select value={type} onChange={(e) => setType(parseInt(e.target.value))}>
            <option value={1}>现价委托</option>
            <option value={2}>市价委托</option>
          </select>
        </div>

        <div className={type === 2 ? 'form-ele-disable' : 'form-ele-input'}>
          <label htmlFor="">价格</label>
          <input type="text" value={price} onChange={(e) => setPrice(e.target.value)} placeholder={type === 2 ? '最优市场价' : '请输入价格'} disabled={type === 2} />
        </div>

        <div className="form-ele-input">
          <label htmlFor="">保证金</label>
          <input type="text" value={bond} onChange={(e) => setBond(e.target.value)} placeholder="最小为2USDT" />
        </div>

        <ul className="form-list-c4">
          <li className={bondRate === 10 ? 'active' : ''} onClick={() => setBondRate(10)}>
            10%
          </li>
          <li className={bondRate === 20 ? 'active' : ''} onClick={() => setBondRate(20)}>
            20%
          </li>
          <li className={bondRate === 50 ? 'active' : ''} onClick={() => setBondRate(50)}>
            50%
          </li>
          <li className={bondRate === 100 ? 'active' : ''} onClick={() => setBondRate(100)}>
            100%
          </li>
        </ul>

        <div className="form-ele-input">
          <label htmlFor="">杠杆</label>
          <input type="text" value={level} onChange={(e) => setLevel(e.target.value)} />
          <span className="unit" style={{ color: '#f4f9ff' }}>
            x
          </span>
        </div>

        <div className="form-slider">
          <OwnSlider disabled={levelMax} value={levelRate} onChange={(e, val) => setLevelRate(val)} step={10} marks={marks} />
        </div>

        <div className="form-ele-desc">
          <label htmlFor="">
            <OwnTooltip title={<React.Fragment>可用最大杠杆根据当前资金池深度以及头寸动态调整</React.Fragment>} arrow placement="bottom">
              <font className="tip-text">当前可用最大杠杆:</font>
            </OwnTooltip>
            75x
          </label>
          <OwnTooltip title={<React.Fragment>根据建仓时可用的最大杠杆建仓</React.Fragment>} arrow placement="bottom-end">
            <span className="sd tip-text">
              <Checkbox size="small" checked={levelMax} onChange={(e) => setLevelMax(e.target.checked)} />
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
                  <SwapHorizIcon style={{ fontSize: '18px', cursor: 'pointer' }} onClick={() => setProfitType(profitType === 1 ? 2 : 1)} />
                  {profitType === 1 ? '价格' : '比例'}
                </span>
              </div>
              <div className="form-ele-input">
                <label htmlFor="">止盈价</label>
                <input type="text" placeholder="输入止盈价" value={profit} onChange={(e) => setProfit(e.target.value)} />
                {profitType === 2 && <span className="unit">%</span>}
              </div>
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
                <label htmlFor="">止损</label>
                <span className="sd">
                  <SwapHorizIcon style={{ fontSize: '18px', cursor: 'pointer' }} onClick={() => setStopType(stopType === 1 ? 2 : 1)} />
                  {profitType === 1 ? '价格' : '比例'}
                </span>
              </div>
              <div className="form-ele-input">
                <label htmlFor="">止损价</label>
                <input type="text" placeholder="输入止损价" value={stop} onChange={(e) => setStop(e.target.value)} />
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
                <li className="active">0.5%</li>
                <li>1.0%</li>
                <li>定制</li>
              </ul>
            </Fragment>
          )}
        </div>

        <div className="form-ele-desc">
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
          <li className={level === 1 ? 'active' : ''} onClick={() => setLevel(1)}>
            Safe
          </li>
          <li className={level === 2 ? 'active' : ''} onClick={() => setLevel(2)}>
            Standard
          </li>
          <li className={level === 3 ? 'active' : ''} onClick={() => setLevel(3)}>
            Fast
          </li>
        </ul>
        {Tools.GT(allowance, 0) ? (
          <button className={`btn-default ${type === 2 ? 'bg-green' : 'bg-red'}`} style={{ width: '100%' }}>
            {type === 2 ? '买涨' : '买跌'}
          </button>
        ) : (
          <button className={`btn-default ${type === 2 ? 'bg-green' : 'bg-red'}`} style={{ width: '100%' }} onClick={() => gainAllowance()}>
            授权USDT
          </button>
        )}
      </div>
    </div>
  );
};

export default OrderComponent;

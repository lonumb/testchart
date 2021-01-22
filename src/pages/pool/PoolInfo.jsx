import React, { useState, useEffect, Fragment, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useWeb3React } from '@web3-react/core';
import { withStyles } from '@material-ui/core/styles';
import MuiAccordion from '@material-ui/core/Accordion';
import MuiAccordionSummary from '@material-ui/core/AccordionSummary';
import MuiAccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import PoolProxyContract from '../../common/contract/PoolProxyContract';
import FundContract from '../../common/contract/FundContract';
import ERC20Contract from '../../common/contract/ERC20Contract';
import TeemoPoolContract from '../../common/contract/TeemoPoolContract';
import * as Tools from '../../utils/Tools';
import { fromWei, toBN, toWei } from 'web3-utils';
import { MAX_UINT256_VALUE } from '../../utils/Constants'

import './poolInfo.scss';

import { useSelector, useDispatch } from 'react-redux';
import * as Types from '../../store/types';
import { PanToolSharp } from '@material-ui/icons';

const Accordion = withStyles({
  root: {
    boxShadow: 'none',
    background: 'transparent',
    color: '#F4F9FF',
    marginBottom: '4px',
    '&:not(:last-child)': { borderBottom: 0 },
    '&:before': { display: 'none' },
    '&$expanded': { margin: 'auto' },
  },
  expanded: {},
})(MuiAccordion);

const AccordionSummary = withStyles({
  root: {
    backgroundColor: '#0F121F',
    minHeight: 80,
    '&$expanded': { minHeight: 80 },
  },
  content: { '&$expanded': { margin: '12px 0' } },
  expanded: {},
  expandIcon: { color: '#788AAE' },
})(MuiAccordionSummary);

const AccordionDetails = withStyles((theme) => ({
  root: {
    background: '#161b2b',
    marginBottom: '4px',
  },
}))(MuiAccordionDetails);

let poolProxyContract = null;
let fundContract = null;
let erc20Contract = null;
const PoolInfo = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const rechargeVisible = useSelector((state) => state.common.rechargeVisible);
  const { active, library, account, chainId } = useWeb3React();
  const [amount, setAmount] = useState('');

  const { poolList } = useSelector((state) => state.contract);
  //const [ totalAmountList, setTotalAmountList ] = useState([]);
  const [ userFundList, setUserFundList ] = useState([]);
  const [ tokenBalanceList, setTokenBalanceList ] = useState([]);
  const [ lptokenBalanceList, setLptokenBalanceList ] = useState([]);
  const [ tokenAllowanceList, setTokenAllowanceList ] = useState([]);
  const [ lptokenAllowanceList, setLptokenAllowanceList ] = useState([]);
  const [ positionInfoList, setPositionInfoList ] = useState([]);
  const [ refreshObj, setRefreshObj ] = useState({});
  
  function isAvailable() {
    return active && account && poolList;
  }

  async function getData() {
    console.log('PoolInfo getData available: ', isAvailable());
    if (!isAvailable()) {
      return Promise.error('not available');
    }
    //var totalAmountPromises = [];
    var userFundPromises = [];
    var tokenBalancePromises = [];
    var lptokenBalancePromises = [];   
    var tokenAllowancePromises = []; 
    var lptokenAllowancePromises = []; 
    for (let poolInfo of poolList) {
      //totalAmountPromises.push(fundContract.getPoolTotalAmount(poolInfo));
      userFundPromises.push(fundContract.getUserFundInfo(poolInfo));
      tokenBalancePromises.push(poolProxyContract.getBalanceByPoolInfo(poolInfo));
      lptokenBalancePromises.push(erc20Contract.getBalanceOf(account, poolInfo.lptokenAddr));
      tokenAllowancePromises.push(poolInfo.erc20Pool ? erc20Contract.getAllowance(account, poolInfo.tokenAddr, poolInfo.poolAddr) : Promise.resolve(MAX_UINT256_VALUE));
      lptokenAllowancePromises.push(erc20Contract.getAllowance(account, poolInfo.lptokenAddr, poolInfo.poolAddr));
    }
    return Promise.all([
      // Promise.all(totalAmountPromises).then((res) => {
      //   console.log('totalAmountList: ', res);
      //   setTotalAmountList(res || []);
      // }),
      Promise.all(userFundPromises).then((res) => {
        console.log('userFundList: ', res);
        setUserFundList(res || []);
      }),
      Promise.all(tokenBalancePromises).then((res) => {
        console.log('tokenBalanceList: ', res);
        setTokenBalanceList(res || []);
      }),
      Promise.all(lptokenBalancePromises).then((res) => {
        console.log('lptokenBalanceList: ', res);
        setLptokenBalanceList(res || []);
      }),
      Promise.all(tokenAllowancePromises).then((res) => {
        console.log('tokenAllowanceList: ', res);
        setTokenAllowanceList(res || []);
      }),
      Promise.all(lptokenAllowancePromises).then((res) => {
        console.log('lptokenAllowanceList: ', res);
        setLptokenAllowanceList(res || []);
      }),
      poolProxyContract.getAllPositionInfo().then((res) => {
        console.log('positionInfoList: ', res);
        setPositionInfoList(res || []);
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
      fundContract = new FundContract(library, chainId, account);
      erc20Contract = new ERC20Contract(library, chainId, account);
      getDataFunc();
    } else {
      poolProxyContract = null;
      fundContract = null;
      erc20Contract = null;
    }
  }, [active, library, account, poolList]);

  const getPositionInfo = (poolAddr) => {
    var result = (positionInfoList || []).filter((item) => item.poolAddr == poolAddr);
    if (result.length > 0) {
      return result[0];
    }
    return null;
  };

  const getLongFormatPosition = (poolInfo) => {
    var positionInfo = getPositionInfo(poolInfo.poolAddr);
    if (!positionInfo) {
      return '0';
    }
    var result = Tools.fromWei(positionInfo.totalL || '0', (poolInfo ? poolInfo.decimals : 0));
    if (result < 0) {
      result = 0;
    }
    return result;
  }

  const getShortFormatPosition = (poolInfo) => {
    var positionInfo = getPositionInfo(poolInfo.poolAddr);
    if (!positionInfo) {
      return '0';
    }
    var result = Tools.fromWei(positionInfo.totalL || '0', (poolInfo ? poolInfo.decimals : 0));
    if (result < 0) {
      result = 0;
    }
    return result;
  }

  const getLongFormatPositionRate = (poolInfo) => {
    var positionInfo = getPositionInfo(poolInfo.poolAddr);
    if (!positionInfo) {
      return '0';
    }
    var totalP = getLongFormatPosition(poolInfo);
    var total = Tools.fromWei(Tools.div(positionInfo.totalAmount || 0, 2), poolInfo ? poolInfo.decimals : 0);
    return Tools.numFmt(totalP / total, 2);
  }

  const getShortFormatPositionRate = (poolInfo) => {
    var positionInfo = getPositionInfo(poolInfo.poolAddr);
    if (!positionInfo) {
      return '0';
    }
    var totalL = getShortFormatPosition(poolInfo);
    var total = Tools.fromWei(Tools.div(positionInfo.totalAmount || 0, 2), poolInfo ? poolInfo.decimals : 0);
    return Tools.numFmt(totalL / total, 2);
  }

  const getTotalPl = (poolInfo) => {
    var p = getLongFormatPosition(poolInfo);
    var l = getShortFormatPosition(poolInfo);
    return Tools.fromWei(Tools.div(p + l, 2), (poolInfo ? poolInfo.decimals : 0));
  }

  const getPledgeAmount = (userFund) => {
    return Tools.sub(userFund.tokenAmountIn, userFund.tokenAmountOut);
  };

  const tokenBalanceFormMaxClick = (poolInfo, index) => {
    if (tokenBalanceList.length > index) {
      poolInfo._tokenBalanceInput = Tools.fromWei(tokenBalanceList[index], poolInfo.decimals);
      setRefreshObj({});
    }
  };

  const tokenBalanceFormInputChanged = (poolInfo, index, value) => {
    let formatValue = Tools.numFmt(value, poolInfo.decimals);
    poolInfo._tokenBalanceInput = formatValue;
    setRefreshObj({});
  };

  const lptokenBalanceFormMaxClick = (poolInfo, index) => {
    if (lptokenBalanceList.length > index) {
      poolInfo._lptokenBalanceInput = Tools.fromWei(lptokenBalanceList[index], poolInfo.lpdecimals);
      setRefreshObj({});
    }
  };

  const lptokenBalanceFormInputChanged = (poolInfo, index, value) => {
    let formatValue = Tools.numFmt(value, poolInfo.lpdecimals);
    poolInfo._lptokenBalanceInput = formatValue;
    setRefreshObj({});
  };

  const isTokenApproved = (poolInfo, index) => {
    if (tokenAllowanceList.length > index) {
      return (tokenAllowanceList[index] || 0) > 0;
    }
    return false;
  };

  const isLptokenApproved = (poolInfo, index) => {
    if (lptokenAllowanceList.length > index) {
      return (lptokenAllowanceList[index] || 0) > 0;
    }
    return false;
  };

  const tokenApprove = (poolInfo, index) => {
    if (!erc20Contract) return;
    erc20Contract
    .approve(account, poolInfo.tokenAddr, poolInfo.poolAddr)      
    .on('error', function (error) {})
    .on('transactionHash', function (hash) {
    })
    .on('receipt', async (receipt) => {
      console.log('approve receipt: ', receipt);
      tokenAllowanceList[index] = MAX_UINT256_VALUE;
      setTokenAllowanceList(tokenAllowanceList);

      await getData();
    });
  };

  const lptokenApprove = (poolInfo, index) => {
    if (!erc20Contract) return;
    erc20Contract
    .approve(account, poolInfo.lptokenAddr, poolInfo.poolAddr)      
    .on('error', function (error) {})
    .on('transactionHash', function (hash) {
    })
    .on('receipt', async (receipt) => {
      console.log('approve receipt: ', receipt);
      lptokenAllowanceList[index] = MAX_UINT256_VALUE;
      setLptokenAllowanceList(lptokenAllowanceList);
      await getData();
    });
  };

  const deposit = (poolInfo, index) => {
    if (!isAvailable() || !poolInfo._tokenBalanceInput) return;

    var teemoPoolContract = new TeemoPoolContract(library, chainId, account);
    teemoPoolContract.lpDeposit(poolInfo, Tools.toWei(poolInfo._tokenBalanceInput, poolInfo.decimals))
    .on('transactionHash', function (hash) {

    })
    .on('receipt', async (receipt) => {
      console.log('充值成功');
      await getData();
    });
  };

  const withdraw = (poolInfo, index) => {
    if (!isAvailable() || !poolInfo._lptokenBalanceInput) return;
    var teemoPoolContract = new TeemoPoolContract(library, chainId, account);
    teemoPoolContract.lpWithdraw(poolInfo, Tools.toWei(poolInfo._lptokenBalanceInput, poolInfo.decimals))
    .on('transactionHash', function (hash) {

    })
    .on('receipt', async (receipt) => {
      console.log('提现成功');
      await getData();
    });
  };

  return (
    <div className="pool-info-wrap">
      <div className="pool-info-box">
        {poolList.map((item, index) => (
          <Accordion key={`ddd${index}`}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <div className="pool-title-box">
                <h1 className="name">{t('poolName', { p: item.symbol })}</h1>
                <div className="line"></div>
                <div className="title-item">
                  <label htmlFor="">{t('poolTotal')}</label>
                  <div className="num">{getPositionInfo(item.poolAddr) ? Tools.fromWei(getPositionInfo(item.poolAddr).totalAmount, item.decimals) : '--' } { item.symbol }</div>
                </div>
                {/* <div className="title-item">
                  <label htmlFor="">{t('poolYearProfit')}</label>
                  <div className="num green">+172.91%</div>
                </div> */}
                <div className="title-item">
                  <label htmlFor="">{t('poolPledge')}</label>
                  <div className="num">{userFundList.length > index ? Tools.fromWei(getPledgeAmount(userFundList[index]), item.decimals) : '--' } { item.symbol }</div>
                </div>
                {/* <div className="title-item">
                  <label htmlFor="">{t('textProfitStop')}</label>
                  <div className="num">
                    <span className="green">18469.48</span> { item.symbol }
                  </div>
                </div>
                <div className="title-item">
                  <label htmlFor="">{t('textProportion')}</label>
                  <div className="num">12.870%</div>
                </div> */}
              </div>
            </AccordionSummary>
            <AccordionDetails>
              <div className="pool-detail-box">
                <span className="title">{t('poolMany')}</span>
                <ul className="info-columns">
                  <li>
                    <label htmlFor="">{t('poolCirculate')}</label>
                    <span>{getPositionInfo(item.poolAddr) ? Tools.fromWei(Tools.div(getPositionInfo(item.poolAddr).totalAmount, 2), item.decimals) : '--' }</span>
                  </li>
                  <li>
                    <label htmlFor="">{t('poolPosition')}</label>
                    <span>{getLongFormatPosition(item)}</span>
                  </li>
                  <li>
                    <label htmlFor="">{t('poolPositionRate')}</label>
                    <span>{getLongFormatPositionRate(item)}%</span>
                  </li>
                </ul>
                <div className="progress-box">
                  <div className="progress-one"></div>
                  <div className="progress-red" style={{ width: `${getLongFormatPositionRate(item)}%` }}></div>
                </div>
                <span className="title">{t('poolEmpty')}</span>
                <ul className="info-columns">
                  <li>
                    <label htmlFor="">{t('poolCirculate')}</label>
                    <span>{getPositionInfo(item.poolAddr) ? Tools.fromWei(Tools.div(getPositionInfo(item.poolAddr).totalAmount, 2), item.decimals) : '--' }</span>
                  </li>
                  <li>
                    <label htmlFor="">{t('poolPosition')}</label>
                    <span>{getShortFormatPosition(item)}</span>
                  </li>
                  <li>
                    <label htmlFor="">{t('poolPositionRate')}</label>
                    <span>{getShortFormatPositionRate(item)}%</span>
                  </li>
                </ul>
                <div className="progress-box">
                  <div className="progress-one"></div>
                  <div className="progress-green" style={{ width: `${getShortFormatPositionRate(item)}%` }}></div>
                </div>
                <div className="loss-profit">
                  {t('poolFloatProfitStop')}： <span className="red">{getTotalPl(item)}</span>
                </div>
                <div className="form-wrap">
                  <div className="form-box">
                    <span className="title">{t('btnPledge')}</span>
                    <label htmlFor="">{t('textNum')}</label>
                    <div className="form-ele-box">
                      <input type="text" placeholder={t('textNumTip')} value={item._tokenBalanceInput || ''} onChange={(e) => tokenBalanceFormInputChanged(item, index, e.target.value)} />
                      <span className="link-btn" onClick={() => tokenBalanceFormMaxClick(item, index)}>
                        MAX
                      </span>
                    </div>
                    <div className="form-ele-desc">
                      {t('textAvailable')}: {tokenBalanceList.length > index ? Tools.fromWei(tokenBalanceList[index], item.decimals) : '--' }
                      {/* <span className="link-btn" onClick={() => dispatch({ type: Types.RECHARGE_VISIBLE, payload: { visible: !rechargeVisible, code: 'BTC' } })}>
                        {t('textRecharge')}
                      </span> */}
                    </div>
                    <div className="form-ele-gain">
                      {/* {t('poolGain')}:- - */}
                    </div>

                    {
                      tokenAllowanceList.length < index ? (<div></div>) 
                      : isTokenApproved(item, index) ? (<button className="btn-default" onClick={e=> deposit(item, index)}>{t('btnPledge')}</button>) 
                      : (<button className="btn-default" onClick={e=> tokenApprove(item, index)}>{t('btnAuth')}</button>)
                    }

                    {/* {tokenBalanceAllowanceList.length > index ? 
                      isApproved(item) ? (<button className="btn-default">{t('btnPledge')}</button>) : (<button className="btn-default">{t('btnPledge')}</button>)
                      : (<div></div>) } */}
                    
                  </div>
                  <div className="line"></div>
                  <div className="form-box">
                    <span className="title">{t('btnUnlock')}</span>
                    <label htmlFor="">{t('textNum')}</label>
                    <div className="form-ele-box">
                      <input type="text" placeholder={t('textNumTip')} value={item._lptokenBalanceInput || ''} onChange={(e) => lptokenBalanceFormInputChanged(item, index, e.target.value)} />
                      <span className="link-btn" onClick={() => lptokenBalanceFormMaxClick(item, index)}>
                        MAX
                      </span>
                    </div>
                    <div className="form-ele-desc">{t('textAvailable')}: {lptokenBalanceList.length > index ? Tools.fromWei(lptokenBalanceList[index], item.decimals) : '--' } {item.symbol} LP Token</div>
                    <div className="form-ele-gain">
                      {/* {t('poolGain')}:- - */}
                    </div>

                    {
                      tokenAllowanceList.length < index ? (<div></div>) 
                      : isLptokenApproved(item, index) ? (<button className="btn-primary" onClick={e=> withdraw(item, index)}>{t('btnUnlock')}</button>) 
                      : (<button className="btn-default" onClick={e=> lptokenApprove(item, index)}>{t('btnAuth')}</button>)
                    }
                    
                  </div>
                  <div className="w180"></div>
                </div>
              </div>
            </AccordionDetails>
          </Accordion>
        ))}
      </div>
    </div>
  );
};

export default PoolInfo;

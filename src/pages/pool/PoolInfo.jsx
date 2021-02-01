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
import MineContract from '../../common/contract/MineContract';
import * as Tools from '../../utils/Tools';
import { fromWei, toBN, toWei } from 'web3-utils';
import { MAX_UINT256_VALUE } from '../../utils/Constants'
import { actionTransactionHashModal } from '../../store/actions/CommonAction';

import './poolInfo.scss';

import { useSelector, useDispatch } from 'react-redux';
import * as Types from '../../store/types';
import { PanToolSharp } from '@material-ui/icons';
import * as HttpUtil from '../../utils/HttpUtil';

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
let mineContract = null;

const isMine = true;//是否挖矿

const PoolInfo = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const rechargeVisible = useSelector((state) => state.common.rechargeVisible);
  const { active, library, account, chainId } = useWeb3React();
  const [amount, setAmount] = useState('');

  const { poolList } = useSelector((state) => state.contract);
  const { productList, productInfo } = useSelector((state) => state.trade);
  //const [ totalAmountList, setTotalAmountList ] = useState([]);
  const [ userFundList, setUserFundList ] = useState([]);
  const [ tokenBalanceList, setTokenBalanceList ] = useState([]);
  const [ lptokenBalanceList, setLptokenBalanceList ] = useState([]);
  const [ tokenAllowanceList, setTokenAllowanceList ] = useState([]);
  const [ lptokenAllowanceList, setLptokenAllowanceList ] = useState([]);
  const [ tokenApprovingObj, setTokenApprovingObj ] = useState({});
  const [ lptokenApprovingObj, setLpTokenApprovingObj ] = useState({});
  const [ positionInfoList, setPositionInfoList ] = useState([]);
  const [ poolFundList, setPoolFundList ] = useState([]);
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
    var poolFundPromises = []; 
    for (let poolInfo of poolList) {
      //totalAmountPromises.push(fundContract.getPoolTotalAmount(poolInfo));
      userFundPromises.push(fundContract.getUserFundInfo(poolInfo));
      tokenBalancePromises.push(poolProxyContract.getBalanceByPoolInfo(poolInfo));
      if (isMine) {
        lptokenBalancePromises.push(new MineContract(library, chainId, account).getUserInfo(poolInfo).then((res) => {
          return res.amount;
        }));
      } else {
        lptokenBalancePromises.push(erc20Contract.getBalanceOf(account, poolInfo.lptokenAddr));
      }

      tokenAllowancePromises.push(poolInfo.erc20Pool ? erc20Contract.getAllowance(account, poolInfo.tokenAddr, poolInfo.poolAddr) : Promise.resolve(MAX_UINT256_VALUE));
      lptokenAllowancePromises.push(erc20Contract.getAllowance(account, poolInfo.lptokenAddr, poolInfo.poolAddr));
      poolFundPromises.push(HttpUtil.URLENCODED_GET('/api/order/querypoolfund.do', {chainId, addr: poolInfo.poolAddr }));
    }
    return Promise.all([
      // Promise.all(totalAmountPromises).then((res) => {
      //   console.log('totalAmountList: ', res);
      //   setTotalAmountList(res || []);
      // }),
      Promise.all(userFundPromises).then((res) => {
        console.log('userFundList: ', res);
        setUserFundList(res || []);
        return res;
      }),
      Promise.all(tokenBalancePromises).then((res) => {
        console.log('tokenBalanceList: ', res);
        setTokenBalanceList(res || []);
        return res;
      }),
      Promise.all(lptokenBalancePromises).then((res) => {
        console.log('lptokenBalanceList: ', res);
        setLptokenBalanceList(res || []);
        return res;
      }),
      Promise.all(tokenAllowancePromises).then((res) => {
        console.log('tokenAllowanceList: ', res);
        setTokenAllowanceList(res || []);
        return res;
      }),
      Promise.all(lptokenAllowancePromises).then((res) => {
        console.log('lptokenAllowanceList: ', res);
        setLptokenAllowanceList(res || []);
        return res;
      }),
      Promise.all(poolFundPromises).then((res) => {
        console.log('poolFundList: ', res);
        setPoolFundList(res || []);
        return res;
      }),
      poolProxyContract.getAllPositionInfo().then((res) => {
        console.log('positionInfoList: ', res);
        setPositionInfoList(res || []);
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

  useEffect(async () => {
    if (active && account && poolList) {
      poolProxyContract = new PoolProxyContract(library, chainId, account);    
      fundContract = new FundContract(library, chainId, account);
      erc20Contract = new ERC20Contract(library, chainId, account);
      mineContract = new MineContract(library, chainId, account);
      getDataFunc();
    } else {
      poolProxyContract = null;
      fundContract = null;
      erc20Contract = null;
      mineContract = null;
    }
  }, [active, library, account, poolList]);

  const getAmountDecimal = (poolAddr) => {
    return 2;
  }

  // const getPositionInfo = (poolAddr) => {
  //   var result = (positionInfoList || []).filter((item) => item.poolAddr == poolAddr);
  //   if (result.length > 0) {
  //     return result[0];
  //   }
  //   return null;
  // };

  // const getLongFormatPosition = (poolInfo) => {
  //   var positionInfo = getPositionInfo(poolInfo.poolAddr);
  //   if (!positionInfo) {
  //     return '0';
  //   }
  //   var result = Tools.fromWei(positionInfo.totalL || '0', (poolInfo ? poolInfo.decimals : 0));
  //   if (result < 0) {
  //     result = 0;
  //   }
  //   return Tools.toStringAsFixed(result, poolInfo.openDecimal);
  // }

  // const getShortFormatPosition = (poolInfo) => {
  //   var positionInfo = getPositionInfo(poolInfo.poolAddr);
  //   if (!positionInfo) {
  //     return '0';
  //   }
  //   var result = Tools.fromWei(positionInfo.totalL || '0', (poolInfo ? poolInfo.decimals : 0));
  //   if (result < 0) {
  //     result = 0;
  //   }
  //   return Tools.toStringAsFixed(result, poolInfo.openDecimal);
  // }

  // const getLongFormatPositionRate = (poolInfo) => {
  //   var positionInfo = getPositionInfo(poolInfo.poolAddr);
  //   if (!positionInfo) {
  //     return '0';
  //   }
  //   var totalP = getLongFormatPosition(poolInfo);
  //   var total = Tools.fromWei(Tools.div(positionInfo.totalAmount || 0, 2), poolInfo ? poolInfo.decimals : 0);
  //   return Tools.numFmt(totalP / total, 2);
  // }

  // const getShortFormatPositionRate = (poolInfo) => {
  //   var positionInfo = getPositionInfo(poolInfo.poolAddr);
  //   if (!positionInfo) {
  //     return '0';
  //   }
  //   var totalL = getShortFormatPosition(poolInfo);
  //   var total = Tools.fromWei(Tools.div(positionInfo.totalAmount || 0, 2), poolInfo ? poolInfo.decimals : 0);
  //   return Tools.numFmt(totalL / total, 2);
  // }

  // const getTotalPl = (poolInfo) => {
  //   var p = getLongFormatPosition(poolInfo);
  //   var l = getShortFormatPosition(poolInfo);
  //   if (l == 0) {
  //     return 0;
  //   }
  //   try {
  //     return Tools.fromWei(Tools.div(p + l, 2), (poolInfo ? poolInfo.decimals : 0));
  //   } catch (e) {
  //     console.log('p ', p);
  //     console.log('l ', l);
  //     console.log(e);
  //   }
  //   return '';
  // }

  const getPoolFundByPoolAddr = (poolAddr) => {
    var poolFund = poolFundList.find((item) => item.f_pool_addr == poolAddr.toLowerCase());
    console.log(poolAddr, poolFund);
    return poolFund;
  };

  const getLongFormatPosition = (poolFund) => {
    var amount = poolFund.f_long_plamount;
    if (amount < 0) {
      amount = 0;
    }
    return Tools.numFmt(amount, 2);
  };

  const getShortFormatPosition = (poolFund) => {
    var amount = poolFund.f_short_plamount;
    if (amount < 0) {
      amount = 0;
    }
    return Tools.numFmt(amount, 2);
  };

  const getLongFormatPositionRate = (poolFund) => {
    if (!poolFund || !poolFund.f_pool_addr || poolFund.f_token_amount_long == 0) return '0';
    var amount = poolFund.f_long_plamount;
    if (amount < 0) {
      amount = 0;
    }
    var result = Tools.div(amount, poolFund.f_token_amount_long);
    result = Tools.mul(result, 100);
    return Tools.numFmt(result, 2);
  };

  const getShortFormatPositionRate = (poolFund) => {
    if (!poolFund || !poolFund.f_pool_addr || poolFund.f_token_amount_short == 0) return '0';
    var amount = poolFund.f_short_plamount;
    if (amount < 0) {
      amount = 0;
    }
    var result = Tools.div(amount, poolFund.f_token_amount_short);
    result = Tools.mul(result, 100);
    return Tools.numFmt(result, 2);
  };

  const getTotalPl = (poolFund) => {
    if (!poolFund || !poolFund.f_pool_addr) return '0';
    var total = parseFloat(poolFund.f_long_plamount) + parseFloat(poolFund.f_short_plamount);
    if (isNaN(total)) {
      total = 0;
    }
    return total;
  };

  const getFormatTotalPl = (poolFund) => {
    return Tools.fmtDec(getTotalPl(poolFund), 18);
  };

  const getPledgeAmount = (userFund) => {
    return Tools.sub(userFund.tokenAmountIn, userFund.tokenAmountOut);
  };

  const tokenBalanceFormMaxClick = (poolInfo, index) => {
    if (tokenBalanceList.length > index) {
      // poolInfo._tokenBalanceInput = Tools.fromWei(tokenBalanceList[index], poolInfo.decimals);
      // setRefreshObj({});
      tokenBalanceFormInputChanged(poolInfo, index, Tools.fromWei(tokenBalanceList[index], poolInfo.decimals));
    }
  };

  const tokenBalanceFormInputChanged = (poolInfo, index, value) => {
    let formatValue = Tools.numFmt(value, poolInfo.openDecimal);
    poolInfo._tokenBalanceInput = formatValue;
    poolInfo._tokenToLpAmount = null;
    // async function getLPAmount() {
    //   var lpAmount = await poolProxyContract.getLPAmount(poolInfo.poolAddr, Tools.toWei(formatValue || 0, poolInfo.decimals));
    //   console.log(`tokenAmount: ${formatValue}, to lpAmount: ${lpAmount}`);
    //   if (formatValue == poolInfo._tokenBalanceInput) {
    //     poolInfo._tokenToLpAmount = lpAmount;
    //     setRefreshObj({});
    //   }
    // }
    // getLPAmount();
    poolInfo._tokenToLpAmount = Tools.toWei(formatValue || 0, poolInfo.decimals);
    setRefreshObj({});
  };

  const lptokenBalanceFormMaxClick = (poolInfo, index) => {
    if (lptokenBalanceList.length > index) {
      // poolInfo._lptokenBalanceInput = Tools.fromWei(lptokenBalanceList[index], poolInfo.lpdecimals);
      // setRefreshObj({});
      lptokenBalanceFormInputChanged(poolInfo, index, Tools.fromWei(lptokenBalanceList[index], poolInfo.lpdecimals));
    }
  };

  const lptokenBalanceFormInputChanged = (poolInfo, index, value) => {
    let formatValue = Tools.numFmt(value, poolInfo.lpdecimals);
    poolInfo._lptokenBalanceInput = formatValue;
    poolInfo._lpAmountToTokenAmount = null;
    // async function getTokenAmount() {
    //   var tokenAmount = await poolProxyContract.getTokenAmount(poolInfo.poolAddr, Tools.toWei(formatValue || 0, poolInfo.lpdecimals));
    //   console.log(`lpTokenAmount: ${formatValue}, to tokenAmount: ${tokenAmount}`);
    //   if (formatValue == poolInfo._lptokenBalanceInput) {
    //     poolInfo._lpAmountToTokenAmount = tokenAmount;
    //     setRefreshObj({});
    //   }
    // }
    // getTokenAmount();
    poolInfo._lpAmountToTokenAmount = Tools.toWei(formatValue || 0, poolInfo.lpdecimals);
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
    if (!erc20Contract || tokenApprovingObj[poolInfo.tokenAddr]) return;
    
    erc20Contract
    .approve(account, poolInfo.tokenAddr, poolInfo.poolAddr)      
    .on('error', function (error) {})
    .on('transactionHash', function (hash) {
      setTokenApprovingObj({ ...tokenApprovingObj, [poolInfo.tokenAddr]: true });
    })
    .on('receipt', async (receipt) => {
      console.log('approve receipt: ', receipt);
      setTokenApprovingObj({ ...tokenApprovingObj, [poolInfo.tokenAddr]: false });
      tokenAllowanceList[index] = MAX_UINT256_VALUE;
      setTokenAllowanceList(tokenAllowanceList);
      await getData();
    });
  };

  const lptokenApprove = (poolInfo, index) => {
    if (!erc20Contract || lptokenApprovingObj[poolInfo.lptokenAddr]) return;
    erc20Contract
    .approve(account, poolInfo.lptokenAddr, poolInfo.poolAddr)      
    .on('error', function (error) {})
    .on('transactionHash', function (hash) {
      setLpTokenApprovingObj({ ...lptokenApprovingObj, [poolInfo.lptokenAddr]: true });
    })
    .on('receipt', async (receipt) => {
      console.log('approve receipt: ', receipt);
      setLpTokenApprovingObj({ ...lptokenApprovingObj, [poolInfo.lptokenAddr]: false });
      lptokenAllowanceList[index] = MAX_UINT256_VALUE;
      setLptokenAllowanceList(lptokenAllowanceList);
      await getData();
    });
  };

  const deposit = (poolInfo, index) => {
    if (!isAvailable() || !poolInfo._tokenBalanceInput) return;

    var teemoPoolContract = new TeemoPoolContract(library, chainId, account);
    teemoPoolContract.lpDeposit(poolInfo, Tools.toWei(poolInfo._tokenBalanceInput, poolInfo.decimals), isMine)
    .on('transactionHash', function (hash) {
      actionTransactionHashModal({ visible: true, hash })(dispatch);
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
      actionTransactionHashModal({ visible: true, hash })(dispatch);
    })
    .on('receipt', async (receipt) => {
      console.log('提现成功');
      await getData();
    });
  };

  const stopMine = (poolInfo, index) => {
    if (!isAvailable() || !poolInfo._lptokenBalanceInput) return;
    var teemoPoolContract = new TeemoPoolContract(library, chainId, account);
    teemoPoolContract.stopMine(poolInfo, Tools.toWei(poolInfo._lptokenBalanceInput, poolInfo.decimals), isMine)
    .on('transactionHash', function (hash) {
      actionTransactionHashModal({ visible: true, hash })(dispatch);
    })
    .on('receipt', async (receipt) => {
      console.log('停止挖矿成功');
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
                  <div className="num">{getPoolFundByPoolAddr(item.poolAddr) ? Tools.toStringAsFixed(getPoolFundByPoolAddr(item.poolAddr).f_token_amount, getAmountDecimal()) : '--' } { item.symbol }</div>
                </div>
                {/* <div className="title-item">
                  <label htmlFor="">{t('poolYearProfit')}</label>
                  <div className="num green">+172.91%</div>
                </div> */}
                <div className="title-item">
                  <label htmlFor="">{t('poolPledge')}</label>
                  <div className="num">{userFundList.length > index ? Tools.toStringAsFixed(Tools.fromWei(getPledgeAmount(userFundList[index]), item.decimals), getAmountDecimal()) : '--' } { item.symbol }</div>
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
                    <span>{getPoolFundByPoolAddr(item.poolAddr) ? Tools.toStringAsFixed(getPoolFundByPoolAddr(item.poolAddr).f_token_amount_long, getAmountDecimal()) : '--' }</span>
                  </li>
                  <li>
                    <label htmlFor="">{t('poolPosition')}</label>
                    <span>{getPoolFundByPoolAddr(item.poolAddr) ? getLongFormatPosition(getPoolFundByPoolAddr(item.poolAddr)) : '--' }</span>
                  </li>
                  <li>
                    <label htmlFor="">{t('poolPositionRate')}</label>
                    <span>{getLongFormatPositionRate(getPoolFundByPoolAddr(item.poolAddr))}%</span>
                  </li>
                </ul>
                <div className="progress-box">
                  <div className="progress-one"></div>
                  <div className="progress-red" style={{ width: `${getLongFormatPositionRate(getPoolFundByPoolAddr(item.poolAddr))}%` }}></div>
                </div>
                <span className="title">{t('poolEmpty')}</span>
                <ul className="info-columns">
                  <li>
                    <label htmlFor="">{t('poolCirculate')}</label>
                    <span>{getPoolFundByPoolAddr(item.poolAddr) ? Tools.toStringAsFixed(getPoolFundByPoolAddr(item.poolAddr).f_token_amount_short, getAmountDecimal()) : '--' }</span>
                  </li>
                  <li>
                    <label htmlFor="">{t('poolPosition')}</label>
                    <span>{getPoolFundByPoolAddr(item.poolAddr) ? getShortFormatPosition(getPoolFundByPoolAddr(item.poolAddr)) : '--' }</span>
                  </li>
                  <li>
                    <label htmlFor="">{t('poolPositionRate')}</label>
                    <span>{getShortFormatPositionRate(getPoolFundByPoolAddr(item.poolAddr))}%</span>
                  </li>
                </ul>
                <div className="progress-box">
                  <div className="progress-one"></div>
                  <div className="progress-green" style={{ width: `${getShortFormatPositionRate(getPoolFundByPoolAddr(item.poolAddr))}%` }}></div>
                </div>
                <div className="loss-profit">
                  {t('poolFloatProfitStop')}： <span className={getTotalPl(getPoolFundByPoolAddr(item.poolAddr)) >= 0 ? 'green' : 'red'}>{getFormatTotalPl(getPoolFundByPoolAddr(item.poolAddr))}</span>
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
                      {t('textAvailable')}: {tokenBalanceList.length > index ? Tools.fromWei(tokenBalanceList[index], item.decimals) : '--' } {item.symbol}
                      {/* <span className="link-btn" onClick={() => dispatch({ type: Types.RECHARGE_VISIBLE, payload: { visible: !rechargeVisible, code: 'BTC' } })}>
                        {t('textRecharge')}
                      </span> */}
                    </div>
                    <div className="form-ele-gain">
                      {t('poolGain')}: {item._tokenToLpAmount ? Tools.fromWei(item._tokenToLpAmount, item.decimals) : '--'} {item.symbol} LP Token
                    </div>

                    {
                      tokenAllowanceList.length < index ? (<div></div>) 
                      : isTokenApproved(item, index) ? (<button className="btn-default" onClick={e=> deposit(item, index)}>{t('btnPledge')}</button>) 
                      : (<button className="btn-default" onClick={e=> tokenApprove(item, index)}>{tokenApprovingObj[item.tokenAddr] ? t('btnAuthing') : t('btnAuth')}</button>)
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
                      {t('poolGain')}: {item._lpAmountToTokenAmount ? Tools.fromWei(item._lpAmountToTokenAmount, item.lpdecimals) : '--'} {item.symbol}
                    </div>

                    {
                      isMine && (<button className="btn-primary" onClick={e=> stopMine(item, index)}>{t('btnUnlock')}</button>)
                    }
                    {
                      !isMine && (tokenAllowanceList.length < index ? (<div></div>) 
                      : isLptokenApproved(item, index) ? (<button className="btn-primary" onClick={e=> withdraw(item, index)}>{t('btnUnlock')}</button>) 
                      : (<button className="btn-default" onClick={e=> lptokenApprove(item, index)}>{lptokenApprovingObj[item.lptokenAddr] == true ? t('btnAuthing') : t('btnAuth')}</button>)
                      )
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

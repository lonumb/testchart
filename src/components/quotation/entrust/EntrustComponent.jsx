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
//import HoldPositionComponent from './subModule/HoldPositionComponent'
import { BSFLAG_LONG, BSFLAG_SHORT } from '../../../utils/Constants'
import { fromWei, toBN, toWei } from 'web3-utils';
import * as Tools from '../../../utils/Tools';

// 止盈比例列表
const profitRateList = [25, 50, 75, 100, 150, 200];
// 止损比例列表
const stopRateList = [30, 40, 50, 60, 70, 80];

let teemoPoolContract;
let swapTradeContract;

const EntrustComponent = () => {
  const { t } = useTranslation();
  const { active, library, account, chainId } = useWeb3React();
  const { poolInfo } = useSelector((state) => state.contract);

  const [recordList] = useState(new Array(7).fill({ a: 'aaa' }));
  const [orderList, setOrderList] = useState([]);
  const [limitOrderList, setLimitOrderList] = useState([]);
  const [type, setType] = useState(1);

  const [visible, setVisible] = useState(false);
  const [profitType, setProfitType] = useState(1); // 止盈类型
  const [profit, setProfit] = useState(''); // 止盈
  const [profitRate, setProfitRate] = useState(''); // 止盈比例
  const [stopType, setStopType] = useState(1); // 止损类型
  const [stop, setStop] = useState(''); // 止损
  const [stopRate, setStopRate] = useState(''); // 止损比例

  function isAvailable() {
    return active && account && poolInfo && poolInfo.poolAddr;
  }

  async function getData() {
    console.log('EntrustComponent getData available: ', isAvailable());
    if (!isAvailable()) {
      return Promise.error('not available');
    }
    return Promise.all([
      swapTradeContract.getAllOrder(poolInfo).then((res) => {
        console.log('getAllOrder: ', res);
        setOrderList(res || []);
        var list = orderList.filter((item) => item.closePrice == 0);
        console.log(`list: `, list);
      }),
      swapTradeContract.getAllLimitOrder(poolInfo).then((res) => {
        console.log('getAllLimitOrder: ', res);
        setLimitOrderList(res || []);
      }),
    ]);
  }

  useEffect(() => {
    if (active && account && poolInfo.poolAddr) {
      teemoPoolContract = new TeemoPoolContract(library, chainId, account);
      swapTradeContract = new SwapTradeContract(library, chainId, account);

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
    if (window.confirm("确定平仓?")) {
      teemoPoolContract
      .closeMarketSwap(poolInfo, order)
      .on('receipt', async (receipt) => {
        alert('平仓成功');
        setOrderList(orderList.filter((item) => item.orderId != order.orderId));
        //await getData();
      });
    }
  }

  //限价单撤销
  const onRevokeLimitOrderClick = (limitOrder) => {
    if (window.confirm("确定撤销?")) {
      teemoPoolContract
      .cancelLimitSwap(poolInfo, limitOrder)
      .on('receipt', async (receipt) => {
        alert('撤销成功');
        setLimitOrderList(limitOrderList.filter((item) => item.orderId != limitOrder.orderId));
        //await getData();
      });
    }
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
          <div className="table-column">合约</div>
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
                <div className="table-column green">{item.bsFlag == BSFLAG_LONG ? '买涨' : '买跌'}</div>
                <div className="table-column">{fromWei(item.openPrice)}</div>
                <div className="table-column">{Tools.fromWei(item.tokenAmount, poolInfo.decimals)} { poolInfo.symbol }</div>
                <div className="table-column">{item.lever} X</div>
                {/* <div className="table-column">+7182.92 USDT</div>
                <div className="table-column">88.88 USDT</div> */}
                <div className="table-column">171292.11</div>
                <div className="table-column">+9128.23 USDT</div>
                <div className="table-column" onClick={() => setVisible(true)}>
                  {item.pLimitPrice != 0 ? fromWei(item.pLimitPrice) : '未设置'} <Edit style={{ fontSize: '14px' }} />
                </div>
                <div className="table-column" onClick={() => setVisible(true)}>
                  {item.lLimitPrice != 0 ? fromWei(item.lLimitPrice) : '未设置'}  <Edit style={{ fontSize: '14px' }} />
                </div>
                <div className="table-column">
                  <span className="link" onClick={(e)=> onCloseOrderClick(item)}>{t('textClose')}</span>
                </div>
              </div>
            );
          })
        )}

        {/* 当前委托 head */}
        {active && type === 2 && (
          <div className="table-head">
          <div className="table-column">合约</div>
          <div className="table-column">{t('textDir')}</div>

          <div className="table-column tip-text">
            <OwnTooltip title={<React.Fragment>{t('entrustPriceDesc')}</React.Fragment>} arrow placement="bottom">
              <span>委托价</span>
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
                <div className="table-column green">{item.bsFlag == BSFLAG_LONG ? '买涨' : '买跌'}</div>
                <div className="table-column">{fromWei(item.openPrice)}</div>
                <div className="table-column">{Tools.fromWei(item.tokenAmount, poolInfo.decimals)} { poolInfo.symbol }</div>
                <div className="table-column">{item.lever} X</div>
                <div className="table-column" onClick={() => setVisible(true)}>
                  {item.pLimitPrice != 0 ? fromWei(item.pLimitPrice) : '未设置'} <Edit style={{ fontSize: '14px' }} />
                </div>
                <div className="table-column" onClick={() => setVisible(true)}>
                  {item.lLimitPrice != 0 ? fromWei(item.lLimitPrice) : '未设置'}  <Edit style={{ fontSize: '14px' }} />
                </div>
                <div className="table-column">
                  <span className="link" onClick={(e)=> onRevokeLimitOrderClick(item)}>撤销</span>
                </div>
              </div>
            );
          })
        )}

        {/* 历史委托 head */}
        {active && type === 3 && (
          <div className="table-head">
          <div className="table-column">合约</div>
          <div className="table-column">{t('textDir')}</div>

          <div className="table-column tip-text">
            <OwnTooltip title={<React.Fragment>{t('entrustPriceDesc')}</React.Fragment>} arrow placement="bottom">
              <span>委托价</span>
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
          <div className="table-column">状态</div>
          <div className="table-column">时间</div>
        </div>
        )}
        {/* 历史委托 body */}
        {active && type === 3 && (
          limitOrderList.filter((item) => item.status == 1 || item.status == 3).map((item, index) => {
            return (
              <div className="table-row" key={`en${index}`}>
                <div className="table-column">{item.symbol.toUpperCase()}</div>
                <div className="table-column green">{item.bsFlag == BSFLAG_LONG ? '买涨' : '买跌'}</div>
                <div className="table-column">{fromWei(item.openPrice)}</div>
                <div className="table-column">{Tools.fromWei(item.tokenAmount, poolInfo.decimals)} { poolInfo.symbol }</div>
                <div className="table-column">{item.lever} X</div>
                <div className="table-column" onClick={() => setVisible(true)}>
                  {item.pLimitPrice != 0 ? fromWei(item.pLimitPrice) : '未设置'} <Edit style={{ fontSize: '14px' }} />
                </div>
                <div className="table-column" onClick={() => setVisible(true)}>
                  {item.lLimitPrice != 0 ? fromWei(item.lLimitPrice) : '未设置'}  <Edit style={{ fontSize: '14px' }} />
                </div>
                <div className="table-column">状态</div>
                <div className="table-column">时间</div>
              </div>
            );
          })
        )}

        {/* 已平仓 head */}
        {active && type === 4 && (
          <div className="table-head">
          <div className="table-column">合约</div>
          <div className="table-column">{t('textDir')}</div>

          <div className="table-column tip-text">
            <OwnTooltip title={<React.Fragment>{t('entrustPriceDesc')}</React.Fragment>} arrow placement="bottom">
              <span>建仓价</span>
            </OwnTooltip>
          </div>

          <div className="table-column tip-text">
            <OwnTooltip title={<React.Fragment>{t('entrustPriceDesc')}</React.Fragment>} arrow placement="bottom">
              <span>平仓价</span>
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
          <div className="table-column">状态</div>
          <div className="table-column">时间</div>
        </div>
        )}
        {/* 已平仓 body */}
        {active && type === 4 && (
          orderList.filter((item) => item.closePrice != 0).map((item, index) => {
            return (
              <div className="table-row" key={`en${index}`}>
                <div className="table-column">{item.symbol.toUpperCase()}</div>
                <div className="table-column green">{item.bsFlag == BSFLAG_LONG ? '买涨' : '买跌'}</div>
                <div className="table-column">{fromWei(item.openPrice)}</div>
                <div className="table-column">{fromWei(item.openPrice)}</div>
                <div className="table-column">{Tools.fromWei(item.tokenAmount, poolInfo.decimals)} { poolInfo.symbol }</div>
                <div className="table-column">{item.lever} X</div>
                <div className="table-column" onClick={() => setVisible(true)}>
                  {item.pLimitPrice != 0 ? fromWei(item.pLimitPrice) : '未设置'} <Edit style={{ fontSize: '14px' }} />
                </div>
                <div className="table-column" onClick={() => setVisible(true)}>
                  {item.lLimitPrice != 0 ? fromWei(item.lLimitPrice) : '未设置'}  <Edit style={{ fontSize: '14px' }} />
                </div>
                <div className="table-column">状态</div>
                <div className="table-column">时间</div>
              </div>
            );
          })
        )}
      </div>
      <OwnDialogModal onClose={() => setVisible(false)} visible={visible} title={t('modalPSTitle')}>
        <div className="stop-update-form">
          <div className="form-ele-desc">
            <label htmlFor="">{t('textProfit')}</label>
            <span className="sd">
              <SwapHorizIcon style={{ fontSize: '18px', cursor: 'pointer' }} onClick={() => setProfitType(profitType === 1 ? 2 : 1)} />
              {profitType === 1 ? t('textPrice') : t('textRate')}
            </span>
          </div>
          <div className="form-ele-input">
            <label htmlFor="">{t('textProfitPrice')}</label>
            <input type="text" placeholder="输入止盈价" value={profit} onChange={(e) => setProfit(e.target.value)} />
            {profitType === 2 && <span className="unit">%</span>}
          </div>
          <div className="form-error">*当前设置的价格将导致修改后订单立即市价成交，请注意</div>
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
            <span className="sd">
              <SwapHorizIcon style={{ fontSize: '18px', cursor: 'pointer' }} onClick={() => setStopType(stopType === 1 ? 2 : 1)} />
              {profitType === 1 ? t('textPrice') : t('textRate')}
            </span>
          </div>
          <div className="form-ele-input">
            <label htmlFor="">{t('textStopPrice')}</label>
            <input type="text" placeholder="输入止损价" value={stop} onChange={(e) => setStop(e.target.value)} />
            {stopType === 2 && <span className="unit">%</span>}
          </div>
          <div className="form-error">*当前设置的价格将导致修改后订单立即市价成交，请注意</div>
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
          <div className="form-error"></div>
          <button className="btn-primary">确认修改</button>
        </div>
      </OwnDialogModal>
    </div>
  );
};

export default EntrustComponent;
import React, { useState } from 'react';
import Edit from '@material-ui/icons/Edit';
import SwapHorizIcon from '@material-ui/icons/SwapHoriz';
import OwnTooltip from '../tooltip/OwnTooltip';
import OwnDialogModal from '../modal/OwnDialog';
import './entrust.scss';

import { useWeb3React } from '@web3-react/core';

// 止盈比例列表
const profitRateList = [25, 50, 75, 100, 150, 200];
// 止损比例列表
const stopRateList = [30, 40, 50, 60, 70, 80];

const EntrustComponent = () => {
  const context = useWeb3React();
  const { active } = context;

  const [recordList] = useState(new Array(7).fill({ a: 'aaa' }));
  const [type, setType] = useState(1);

  const [visible, setVisible] = useState(false);
  const [profitType, setProfitType] = useState(1); // 止盈类型
  const [profit, setProfit] = useState(''); // 止盈
  const [profitRate, setProfitRate] = useState(''); // 止盈比例
  const [stopType, setStopType] = useState(1); // 止损类型
  const [stop, setStop] = useState(''); // 止损
  const [stopRate, setStopRate] = useState(''); // 止损比例

  return (
    <div className="entrust">
      <div className="tab-box">
        <ul>
          <li className={type === 1 ? 'active' : ''} onClick={() => setType(1)}>
            持仓
          </li>
          <li className={type === 2 ? 'active' : ''} onClick={() => setType(2)}>
            当前委托
          </li>
          <li className={type === 3 ? 'active' : ''} onClick={() => setType(3)}>
            历史委托
          </li>
          <li className={type === 4 ? 'active' : ''} onClick={() => setType(4)}>
            已平仓
          </li>
        </ul>
      </div>
      <div className="table-box">
        <div className="table-head">
          <div className="table-column">合约</div>
          <div className="table-column">方向</div>

          <div className="table-column tip-text">
            <OwnTooltip title={<React.Fragment>建仓时的行情报价</React.Fragment>} arrow placement="bottom">
              <span>建仓价</span>
            </OwnTooltip>
          </div>

          <div className="table-column">保证金</div>
          <div className="table-column">杠杆</div>
          <div className="table-column tip-text">
            <OwnTooltip title={<React.Fragment>当前已收取/奖励的资金费用</React.Fragment>} arrow placement="bottom">
              <span>资金费用</span>
            </OwnTooltip>
          </div>
          <div className="table-column tip-text">
            <OwnTooltip title={<React.Fragment>平仓时需支付的持仓费用</React.Fragment>} arrow placement="bottom">
              <span>持仓费用</span>
            </OwnTooltip>
          </div>
          <div className="table-column tip-text">
            <OwnTooltip title={<React.Fragment>预计在该点位对这笔订单执行清算</React.Fragment>} arrow placement="bottom">
              <span>预估强平价</span>
            </OwnTooltip>
          </div>
          <div className="table-column tip-text">
            <OwnTooltip title={<React.Fragment>平仓时可获得的盈亏</React.Fragment>} arrow placement="bottom">
              <span>未实现盈亏</span>
            </OwnTooltip>
          </div>
          <div className="table-column tip-text">
            <OwnTooltip title={<React.Fragment>预计在这个报价自动止盈平仓</React.Fragment>} arrow placement="bottom">
              <span>止盈价</span>
            </OwnTooltip>
          </div>
          <div className="table-column tip-text">
            <OwnTooltip title={<React.Fragment>预计在这个报价自动止损平仓</React.Fragment>} arrow placement="bottom">
              <span>止损价</span>
            </OwnTooltip>
          </div>
          <div className="table-column">操作</div>
        </div>

        {active ? (
          recordList.map((item, index) => {
            return (
              <div className="table-row" key={`en${index}`}>
                <div className="table-column">BTCUSDT</div>
                <div className="table-column green">买涨</div>
                <div className="table-column">17526.22</div>
                <div className="table-column">9129.22 USDT</div>
                <div className="table-column">10x</div>
                <div className="table-column">+7182.92 USDT</div>
                <div className="table-column">88.88 USDT</div>
                <div className="table-column">171292.11</div>
                <div className="table-column">+9128.23 USDT</div>
                <div className="table-column" onClick={() => setVisible(true)}>
                  18101.22 <Edit style={{ fontSize: '14px' }} />
                </div>
                <div className="table-column" onClick={() => setVisible(true)}>
                  未设置 <Edit style={{ fontSize: '14px' }} />
                </div>
                <div className="table-column">
                  <span className="link">平仓</span>
                </div>
              </div>
            );
          })
        ) : (
          <div className="no-login">
            <button className="btn-primary">连接钱包后查看</button>
          </div>
        )}
      </div>

      <OwnDialogModal onClose={() => setVisible(false)} visible={visible} title="修改止盈止损">
        <div className="stop-update-form">
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

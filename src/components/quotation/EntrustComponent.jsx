import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();
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
          <div className="table-column tip-text">
            <OwnTooltip title={<React.Fragment>{t('textCapitalDesc')}</React.Fragment>} arrow placement="bottom">
              <span>{t('textCapital')}</span>
            </OwnTooltip>
          </div>
          <div className="table-column tip-text">
            <OwnTooltip title={<React.Fragment>{t('textPositionDesc')}</React.Fragment>} arrow placement="bottom">
              <span>{t('textPosition')}</span>
            </OwnTooltip>
          </div>
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
                  {t('entrustSPPriceTip')} <Edit style={{ fontSize: '14px' }} />
                </div>
                <div className="table-column">
                  <span className="link">{t('textClose')}</span>
                </div>
              </div>
            );
          })
        ) : (
          <div className="no-login">
            <button className="btn-primary">{t('walletUnconnectTip')}</button>
          </div>
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

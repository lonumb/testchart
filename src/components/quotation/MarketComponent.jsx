import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import ArrowDropDownRoundedIcon from '@material-ui/icons/ArrowDropDownRounded';
import OwnTooltip from '../tooltip/OwnTooltip';
import OwnPopover from '../popover/OwnPopover';
import { usePopupState, bindHover, bindPopover } from 'material-ui-popup-state/hooks';
import './market.scss';

const MarketComponent = () => {
  const { t } = useTranslation();
  const popupState = usePopupState({ variant: 'popover', popupId: 'coinPopover' });

  return (
    <div className="market">
      <div className="current-coin" {...bindHover(popupState)}>
        BTCUSDT
        <ArrowDropDownRoundedIcon style={{ fontSize: 32, margin: '-3px 0 0 -5px' }} />
        <OwnPopover {...bindPopover(popupState)} anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }} transformOrigin={{ vertical: 'top', horizontal: 'left' }}>
          <ul className="coin-list">
            <li className="active">ETHUSDT</li>
            <li>BTCUSDT</li>
            <li>EOSUSDT</li>
            <li>QTUMUSDT</li>
          </ul>
        </OwnPopover>
      </div>
      <div className="market-item">
        <span className="fz16 red">10109.02</span>
        <label htmlFor="">≈10109.02 CNY</label>
      </div>
      <div className="market-item">
        <OwnTooltip
          title={
            <React.Fragment>
              <span className="colorDefault fz14">每10分钟收取1次</span> <br />
              <span className="colorDefault fz14">当前费率:0.006%</span> <br />
              * 正数代表多方给予空方 <br />* 负数代表空方给予多方
            </React.Fragment>
          }
          arrow
          placement="bottom"
        >
          <label htmlFor="" className="tip-text">
            资金费率
          </label>
        </OwnTooltip>
        <span>0.006%</span>
      </div>
      <div className="market-item">
        <OwnTooltip
          title={
            <React.Fragment>
              <span className="colorDefault fz14">每8小时收取1次</span> <br />
              <span className="colorDefault fz14">当前费率:0.006%</span>
            </React.Fragment>
          }
          arrow
          placement="bottom"
        >
          <label htmlFor="" className="tip-text">
            持仓费率
          </label>
        </OwnTooltip>
        <span>0.006%</span>
      </div>
      <div className="market-item">
        <label htmlFor="">24H涨跌幅</label>
        <span className="green">+2.36%</span>
      </div>
      <div className="market-item">
        <label htmlFor="">24H High</label>
        <span>10109.02</span>
      </div>
      <div className="market-item">
        <label htmlFor="">24H Low</label>
        <span>10109.02</span>
      </div>
    </div>
  );
};

export default MarketComponent;

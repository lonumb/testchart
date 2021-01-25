import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import ArrowDropDownRoundedIcon from '@material-ui/icons/ArrowDropDownRounded';
import { usePopupState, bindHover, bindPopover, bindToggle } from 'material-ui-popup-state/hooks';
import { useSelector, useDispatch } from 'react-redux';
import { actionProductInfo } from '../../store/actions/TradeAction';
import OwnTooltip from '../tooltip/OwnTooltip';
import OwnPopover from '../popover/OwnPopover';
import * as Tools from '../../utils/Tools';
import './market.scss';

const MarketComponent = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const popupState = usePopupState({ variant: 'popover', popupId: 'coinPopover' });
  const { productList, productInfo, tickerAll } = useSelector((state) => state.trade); // 币种列表

  return (
    <div className="market">
      <div className="current-coin" {...bindHover(popupState)} {...bindToggle(popupState)}>
        {productInfo.symbol}/{productInfo.legalSymbol}
        <ArrowDropDownRoundedIcon style={{ fontSize: 32, margin: '-3px 0 0 -5px' }} />
        <OwnPopover {...bindPopover(popupState)} anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }} transformOrigin={{ vertical: 'top', horizontal: 'left' }}>
          <ul className="coin-list">
            {productList.map((item) => {
              return (
                <li key={item.symbol} className={item.symbol === productInfo.symbol && 'active'} onClick={() => actionProductInfo(item)(dispatch)}>
                  {item.symbol}/{item.legalSymbol}
                </li>
              );
            })}
          </ul>
        </OwnPopover>
      </div>
      <div className="market-item">
        <span className={`fz16 ${tickerAll['1D'].CC}`}>{Tools.toStringAsFixed(tickerAll['1D'].close || 0, productInfo.decimal || 2)}</span>
        {/* <label htmlFor="">≈10109.02 CNY</label> */}
      </div>
      {/* <div className="market-item">
        <OwnTooltip
          title={
            <React.Fragment>
              <span className="colorDefault fz14">{t('textCapitalRateDesc1', { p: '10' })}</span> <br />
              <span className="colorDefault fz14">{t('textCapitalRateDesc2', { p: `0.006%` })}</span> <br />
              {t('textCapitalRateDesc3')} <br />
              {t('textCapitalRateDesc4')}
            </React.Fragment>
          }
          arrow
          placement="bottom"
        >
          <label htmlFor="" className="tip-text">
            {t('textCapitalRate')}
          </label>
        </OwnTooltip>
        <span>0.006%</span>
      </div> */}
      {/* <div className="market-item">
        <OwnTooltip
          title={
            <React.Fragment>
              <span className="colorDefault fz14">{t('textPositionRateDesc1', { p: '10' })}</span> <br />
              <span className="colorDefault fz14">{t('textPositionRateDesc2', { p: `0.006%` })}</span>
            </React.Fragment>
          }
          arrow
          placement="bottom"
        >
          <label htmlFor="" className="tip-text">
            {t('textPositionRate')}
          </label>
        </OwnTooltip>
        <span>0.006%</span>
      </div> */}
      <div className="market-item">
        <label htmlFor="">{t('textHUpDown')}</label>
        <span className={tickerAll['1D'].UDC}>{Tools.toStringAsFixed(tickerAll['1D'].UDR || 0, productInfo.decimal || 2)}%</span>
      </div>
      <div className="market-item">
        <label htmlFor="">{t('textHHigh')}</label>
        <span>{Tools.toStringAsFixed(tickerAll['1D'].high || 0, productInfo.decimal || 2)}</span>
      </div>
      <div className="market-item">
        <label htmlFor="">{t('textHLow')}</label>
        <span>{Tools.toStringAsFixed(tickerAll['1D'].low || 0, productInfo.decimal || 2)}</span>
      </div>
    </div>
  );
};

export default MarketComponent;

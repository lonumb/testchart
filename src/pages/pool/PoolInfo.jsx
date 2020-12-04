import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { withStyles } from '@material-ui/core/styles';
import MuiAccordion from '@material-ui/core/Accordion';
import MuiAccordionSummary from '@material-ui/core/AccordionSummary';
import MuiAccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import './poolInfo.scss';

import { useSelector, useDispatch } from 'react-redux';
import * as Types from '../../store/types';

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

const PoolInfo = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const rechargeVisible = useSelector((state) => state.common.rechargeVisible);

  const [dataList] = useState(new Array(10).fill(1));
  const [amount, setAmount] = useState('');

  return (
    <div className="pool-info-wrap">
      <div className="pool-info-box">
        {dataList.map((item, index) => (
          <Accordion key={`ddd${index}`}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <div className="pool-title-box">
                <h1 className="name">{t('poolName', { p: `USDT${index}` })}</h1>
                <div className="line"></div>
                <div className="title-item">
                  <label htmlFor="">{t('poolTotal')}</label>
                  <div className="num">1728402.736192 USDT</div>
                </div>
                <div className="title-item">
                  <label htmlFor="">{t('poolYearProfit')}</label>
                  <div className="num green">+172.91%</div>
                </div>
                <div className="title-item">
                  <label htmlFor="">{t('poolPledge')}</label>
                  <div className="num">81920.000000 USDT</div>
                </div>
                <div className="title-item">
                  <label htmlFor="">{t('textProfitStop')}</label>
                  <div className="num">
                    <span className="green">18469.48</span> USDT
                  </div>
                </div>
                <div className="title-item">
                  <label htmlFor="">{t('textProportion')}</label>
                  <div className="num">12.870%</div>
                </div>
              </div>
            </AccordionSummary>
            <AccordionDetails>
              <div className="pool-detail-box">
                <span className="title">{t('poolMany')}</span>
                <ul className="info-columns">
                  <li>
                    <label htmlFor="">{t('poolCirculate')}</label>
                    <span>81949.736192</span>
                  </li>
                  <li>
                    <label htmlFor="">{t('poolPosition')}</label>
                    <span>172849.736192</span>
                  </li>
                  <li>
                    <label htmlFor="">{t('poolPositionRate')}</label>
                    <span>50.10%</span>
                  </li>
                </ul>
                <div className="progress-box">
                  <div className="progress-one"></div>
                  <div className="progress-red" style={{ width: '60%' }}></div>
                </div>
                <span className="title">{t('poolEmpty')}</span>
                <ul className="info-columns">
                  <li>
                    <label htmlFor="">{t('poolCirculate')}</label>
                    <span>81949.736192</span>
                  </li>
                  <li>
                    <label htmlFor="">{t('poolPosition')}</label>
                    <span>172849.736192</span>
                  </li>
                  <li>
                    <label htmlFor="">{t('poolPositionRate')}</label>
                    <span>50.10%</span>
                  </li>
                </ul>
                <div className="progress-box">
                  <div className="progress-one"></div>
                  <div className="progress-green" style={{ width: '30%' }}></div>
                </div>
                <div className="loss-profit">
                  {t('poolFloatProfitStop')}： <span className="red">-9829.112930</span>
                </div>
                <div className="form-wrap">
                  <div className="form-box">
                    <span className="title">{t('btnPledge')}</span>
                    <label htmlFor="">{t('textNum')}</label>
                    <div className="form-ele-box">
                      <input type="text" placeholder={t('textNumTip')} value={amount} onChange={(e) => setAmount(e.target.value)} />
                      <span className="link-btn" onClick={() => setAmount('')}>
                        MAX
                      </span>
                    </div>
                    <div className="form-ele-desc">
                      {t('textAvailable')}(Layer 2):18272.129492
                      <span className="link-btn" onClick={() => dispatch({ type: Types.RECHARGE_VISIBLE, payload: { visible: !rechargeVisible, code: 'BTC' } })}>
                        {t('textRecharge')}
                      </span>
                    </div>
                    <div className="form-ele-gain">{t('poolGain')}:- -</div>
                    <button className="btn-default">{t('btnPledge')}</button>
                  </div>
                  <div className="line"></div>
                  <div className="form-box">
                    <span className="title">{t('btnUnlock')}</span>
                    <label htmlFor="">{t('textNum')}</label>
                    <div className="form-ele-box">
                      <input type="text" placeholder={t('textNumTip')} value={amount} onChange={(e) => setAmount(e.target.value)} />
                      <span className="link-btn" onClick={() => setAmount('')}>
                        MAX
                      </span>
                    </div>
                    <div className="form-ele-desc">{t('textAvailable')}(Layer 2):18272.129492 USDT LP Token</div>
                    <div className="form-ele-gain">{t('poolGain')}:- -</div>
                    <button className="btn-primary">{t('btnUnlock')}</button>
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

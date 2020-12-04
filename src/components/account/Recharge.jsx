import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Dialog from '../modal/OwnDialog';
import { useSelector, useDispatch } from 'react-redux';
import * as Types from '../../store/types';
import './rw.scss';

const Recharge = (props) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { visible } = useSelector((state) => state.common.recharge);

  const [coin, setCoin] = useState('');
  const [amount, setAmount] = useState('');

  function closeModal() {
    return dispatch({ type: Types.RECHARGE_VISIBLE, payload: { visible: !visible } });
  }

  function handleSubmit() {
    closeModal();
  }

  return (
    <Dialog visible={visible} title={t('textRecharge')} onClose={closeModal}>
      <div className="rw-form-wrap">
        <div className="form-ele-wrap mb20">
          <label htmlFor="">{t('textToken')}</label>
          <div className="form-ele-box">
            <select value={coin} onChange={(e) => setCoin(e.target.value)}>
              <option value="ETH">ETH</option>
              <option value="BTC">BTC</option>
              <option value="USDT">USDT</option>
            </select>
          </div>
        </div>
        <div className="form-ele-wrap">
          <label htmlFor="">{t('textNum')}</label>
          <div className="form-ele-box">
            <input type="text" placeholder={t('textNumTip')} value={amount} onChange={(e) => setAmount(e.target.value)} />
            <span className="link-btn" onClick={() => setAmount('')}>
              MAX
            </span>
          </div>
        </div>
        <div className="form-ele-tip mb20">{t('textAvailable')}(ETH Main):18272.129492</div>
        <div className="form-ele-btn">
          <button className="btn-default" onClick={closeModal}>
            {t('btnCancel')}
          </button>
          <button className="btn-primary" onClick={handleSubmit}>
            {t('btnConfirm')}
          </button>
        </div>
      </div>
    </Dialog>
  );
};

export default Recharge;

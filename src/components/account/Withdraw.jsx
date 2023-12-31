import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Dialog from '../modal/OwnDialog';
import { useSelector, useDispatch } from 'react-redux';
import * as Types from '../../store/types';
import './rw.scss';

const Withdraw = (props) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { visible } = useSelector((state) => state.common.withdraw);

  const [coin, setCoin] = useState('');
  const [amount, setAmount] = useState('');

  function closeModal() {
    dispatch({ type: Types.WITHDRAW_VISIBLE, payload: { visible: !visible } });
  }

  function handleSubmit() {
    closeModal();
  }

  return (
    <Dialog visible={visible} title={t('textWithdraw')} onClose={closeModal}>
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
        <div className="form-ele-wrap mb20">
          <label htmlFor="">{t('textNum')}</label>
          <div className="form-ele-box">
            <input type="text" placeholder={t('textNumTip')} value={amount} onChange={(e) => setAmount(e.target.value)} />
            <span className="link-btn" onClick={() => setAmount('')}>
              MAX
            </span>
          </div>
        </div>
        <div className="form-ele-wrap mb20">
          <label htmlFor="">{t('modalLabelWithdrawTo')}</label>
          <div className="form-ele-desc">
            <span>0x0572a83a96005ef6f280e650abf7b3a548325d7d389886461a278839b58b8934</span>
          </div>
        </div>
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

export default Withdraw;

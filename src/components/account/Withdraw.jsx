import React from 'react';
import Dialog from '../modal/OwnDialog';
import { useSelector, useDispatch } from 'react-redux';
import * as Types from '../../store/types';
import './rw.scss';

const Withdraw = (props) => {
  const dispatch = useDispatch();
  const { visible } = useSelector((state) => state.common.withdraw);

  return (
    <Dialog
      visible={visible}
      title="提现"
      onClose={() => {
        dispatch({ type: Types.WITHDRAW_VISIBLE, payload: { visible: !visible } });
      }}
    >
      <div className="rw-form-wrap">
        <div className="form-ele-wrap mb20">
          <label htmlFor="">代币</label>
          <div className="form-ele-box">
            <select name="" id="">
              <option value="">ddd</option>
            </select>
          </div>
        </div>
        <div className="form-ele-wrap mb20">
          <label htmlFor="">数量</label>
          <div className="form-ele-box">
            <input type="text" placeholder="aaaa" />
            <span className="link-btn">MAX</span>
          </div>
        </div>
        <div className="form-ele-wrap mb20">
          <label htmlFor="">提现至</label>
          <div className="form-ele-desc">
            <span>0x0572a83a96005ef6f280e650abf7b3a548325d7d389886461a278839b58b8934</span>
          </div>
        </div>
        <div className="form-ele-btn">
          <button className="btn-default">取消</button>
          <button className="btn-primary">确认</button>
        </div>
      </div>
    </Dialog>
  );
};

export default Withdraw;

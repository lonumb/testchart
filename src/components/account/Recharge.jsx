import React from 'react';
import Dialog from '../modal/OwnDialog';
import { useSelector, useDispatch } from 'react-redux';
import * as Types from '../../store/types';
import './rw.scss';

const Recharge = (props) => {
  const dispatch = useDispatch();
  const { visible } = useSelector((state) => state.common.recharge);

  return (
    <Dialog
      visible={visible}
      title="充值"
      onClose={() => {
        dispatch({ type: Types.RECHARGE_VISIBLE, payload: { visible: !visible } });
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
        <div className="form-ele-wrap">
          <label htmlFor="">数量</label>
          <div className="form-ele-box">
            <input type="text" placeholder="aaaa" />
            <span className="link-btn">MAX</span>
          </div>
        </div>
        <div className="form-ele-tip mb20">可用(ETH Main):18272.129492</div>
        <div className="form-ele-btn">
          <button className="btn-default">取消</button>
          <button className="btn-primary">确认</button>
        </div>
      </div>
    </Dialog>
  );
};

export default Recharge;

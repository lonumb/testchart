import React, { useState } from 'react';
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
                <h1 className="name">USDT{index}池</h1>
                <div className="line"></div>
                <div className="title-item">
                  <label htmlFor="">总量</label>
                  <div className="num">1728402.736192 USDT</div>
                </div>
                <div className="title-item">
                  <label htmlFor="">年化收益</label>
                  <div className="num green">+172.91%</div>
                </div>
                <div className="title-item">
                  <label htmlFor="">我质押的</label>
                  <div className="num">81920.000000 USDT</div>
                </div>
                <div className="title-item">
                  <label htmlFor="">盈亏</label>
                  <div className="num">
                    <span className="green">18469.48</span> USDT
                  </div>
                </div>
                <div className="title-item">
                  <label htmlFor="">占比</label>
                  <div className="num">12.870%</div>
                </div>
              </div>
            </AccordionSummary>
            <AccordionDetails>
              <div className="pool-detail-box">
                <span className="title">多头</span>
                <ul className="info-columns">
                  <li>
                    <label htmlFor="">流通</label>
                    <span>81949.736192</span>
                  </li>
                  <li>
                    <label htmlFor="">头寸</label>
                    <span>172849.736192</span>
                  </li>
                  <li>
                    <label htmlFor="">头寸占比</label>
                    <span>50.10%</span>
                  </li>
                </ul>
                <div className="progress-box">
                  <div className="progress-one"></div>
                  <div className="progress-red" style={{ width: '60%' }}></div>
                </div>
                <span className="title">空头</span>
                <ul className="info-columns">
                  <li>
                    <label htmlFor="">流通</label>
                    <span>81949.736192</span>
                  </li>
                  <li>
                    <label htmlFor="">头寸</label>
                    <span>172849.736192</span>
                  </li>
                  <li>
                    <label htmlFor="">头寸占比</label>
                    <span>50.10%</span>
                  </li>
                </ul>
                <div className="progress-box">
                  <div className="progress-one"></div>
                  <div className="progress-green" style={{ width: '30%' }}></div>
                </div>
                <div className="loss-profit">
                  多空浮动盈亏： <span className="red">-9829.112930</span>
                </div>
                <div className="form-wrap">
                  <div className="form-box">
                    <span className="title">质押</span>
                    <label htmlFor="">数量</label>
                    <div className="form-ele-box">
                      <input type="text" placeholder="请输入数量" value={amount} onChange={(e) => setAmount(e.target.value)} />
                      <span className="link-btn" onClick={() => setAmount('')}>
                        MAX
                      </span>
                    </div>
                    <div className="form-ele-desc">
                      可用(Layer 2):18272.129492
                      <span className="link-btn" onClick={() => dispatch({ type: Types.RECHARGE_VISIBLE, payload: { visible: !rechargeVisible, code: 'BTC' } })}>
                        充值
                      </span>
                    </div>
                    <div className="form-ele-gain">获得:- -</div>
                    <button className="btn-default">质押</button>
                  </div>
                  <div className="line"></div>
                  <div className="form-box">
                    <span className="title">解锁</span>
                    <label htmlFor="">数量</label>
                    <div className="form-ele-box">
                      <input type="text" placeholder="请输入数量" value={amount} onChange={(e) => setAmount(e.target.value)} />
                      <span className="link-btn" onClick={() => setAmount('')}>
                        MAX
                      </span>
                    </div>
                    <div className="form-ele-desc">可用(Layer 2):18272.129492 USDT LP Token</div>
                    <div className="form-ele-gain">获得:- -</div>
                    <button className="btn-primary">解锁</button>
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

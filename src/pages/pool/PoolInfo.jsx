import React, { useState } from 'react';
import HeaderComponent from '../../components/quotation/HeaderComponent';
import { withStyles } from '@material-ui/core/styles';
import MuiAccordion from '@material-ui/core/Accordion';
import MuiAccordionSummary from '@material-ui/core/AccordionSummary';
import MuiAccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import './poolInfo.scss';

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
  const [dataList] = useState(new Array(10).fill(1));

  return (
    <div className="pool-info-wrap">
      <HeaderComponent></HeaderComponent>
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
            <AccordionDetails>1111111111111111</AccordionDetails>
          </Accordion>
        ))}
      </div>
    </div>
  );
};

export default PoolInfo;

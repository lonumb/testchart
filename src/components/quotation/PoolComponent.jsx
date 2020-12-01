import React, { useState, useRef, useEffect } from 'react';
import './pool.scss';

const PoolComponent = () => {
  const poolRef = useRef();
  const [poolHeight, setPoolHeight] = useState(0);

  useEffect(() => {
    console.log(poolRef.current.clientHeight);
    // 设置列表高度
    setPoolHeight(poolRef.current.clientHeight - 65);
  }, []);

  return (
    <div className="pool" ref={poolRef}>
      <div className="title-box">流动池(ETH)</div>
      <div className="rate-box">
        <div className="block-column block-red" style={{ height: `${poolHeight}px` }}>
          <div className="block" style={{ height: `${30}%` }}></div>
        </div>
        <div className="block-column block-green" style={{ height: `${poolHeight}px` }}>
          <div className="block" style={{ height: `${60}%` }}></div>
        </div>
        <div className="block-info">
          <div className="row">
            <span className="label0">多头</span>
            <span className="label1">流通:</span>
            <span className="label2">1234414</span>
            <span className="label3">(30.22%)</span>
            <span className="label1">头寸:</span>
            <span className="label2">1234414</span>
            <span className="label3">(30.22%)</span>
          </div>
          <div className="row">
            <span className="label0">空头</span>
            <span className="label1">流通:</span>
            <span className="label2">1234414</span>
            <span className="label3">(30.22%)</span>
            <span className="label1">头寸:</span>
            <span className="label2">1234414</span>
            <span className="label3">(30.22%)</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PoolComponent;

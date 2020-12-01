import React, { useState, useRef, useEffect } from 'react';
import Reply from '@material-ui/icons/Reply';
import './record.scss';

const RecordComponent = () => {
  const recordRef = useRef();
  const [recordList, setRecordList] = useState([]);
  const [listHeight, setListHeight] = useState(0);

  useEffect(() => {
    // 设置记录列表
    setRecordList(new Array(50).fill({ a: 'aaa' }));
  }, []);

  useEffect(() => {
    // 设置列表高度
    setListHeight(recordRef.current.clientHeight - 56);
  }, []);

  return (
    <div className="record" ref={recordRef}>
      <div className="title-box">最新成交</div>
      <div className="list-title">
        <div className="column">时间</div>
        <div className="column">类型</div>
        <div className="column">价格(USDT)</div>
        <div className="column">头寸 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div>
      </div>
      <div className="list-wrap">
        <div className="list-view" style={{ height: `${listHeight}px` }}>
          {recordList.map((item, index) => {
            return (
              <div className="list-item" key={index}>
                <div className="column">18:57:20</div>
                <div className="column">建仓</div>
                <div className={`column ${index % 3 === 0 ? 'red' : 'green'}`}>17545.42</div>
                <div className="column">
                  0.242114 {index % 7 === 0 ? 'Sushi' : 'BTC'} <Reply />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default RecordComponent;

import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Reply from '@material-ui/icons/Reply';
import './record.scss';

const RecordComponent = () => {
  const { t } = useTranslation();
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
      <div className="title-box">{t('tradeDealTitle')}</div>
      <div className="list-title">
        <div className="column">{t('textTime')}</div>
        <div className="column">{t('textType')}</div>
        <div className="column">{t('textPrice')}(USDT)</div>
        <div className="column">{t('poolPosition')} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div>
      </div>
      <div className="list-wrap">
        <div className="list-view" style={{ height: `${listHeight}px` }}>
          {recordList.map((item, index) => {
            return (
              <div className="list-item" key={index}>
                <div className="column">18:57:20</div>
                <div className="column">{t('textClose')}</div>
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

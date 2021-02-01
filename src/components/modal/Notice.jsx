import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import OwnBase from './OwnBase';
import './notice.scss'
const Notice = (props) => {
    const { t } = useTranslation();

    const { visible, title} = props;
    const [checked, setChecked] = useState(0);

  return (
      <div className="noticeBox">
            <OwnBase onClose={props.onClose} visible={visible} title={title}>
                <div className="noticeModal" visible={true}>
                    <div className="noticeModal-img">
                        <img src="/imgs/img_notice.png" alt=""/>
                    </div>
                    <div className="noticeModal">
                        <span className="notice-title">{t('Notice_title')}</span>
                        <div className="notice-test">
                        {t('Notice_text1')}
                        </div>
                        <span>{t('Notice_text2')}</span>
                        <div className="notice-check">
                            <input type="checkbox" name="like" value={checked} onChange={e => setChecked(e.target.value)}/>{t('Notice_text3')}
                        </div>
                        <div className="notice-button">
                            <button  className="notice-button-left" onClick={e => window.open('https://mvp.teemo.finance/trade')}>{t('Notice_button1')}</button>
                            <button className="notice-button-right" onClick={e => props.onClick(checked)}>{t('Notice_button2')}</button>
                        </div>
                    </div>
                </div>
            </OwnBase>
      </div>

  )
};

export default Notice;

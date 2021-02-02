import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Dialog from '@material-ui/core/Dialog';
import './white.scss'

const WhiteList = (props) => {
    const { t } = useTranslation();

    const { visible, title} = props;
    const [content, setContent] = useState('');

    return (
        <div>
            <Dialog onClose={props.onClose} visible={true} title={title} open={visible} className="whiteList">
                <div className="whiteListModal" visible={true}>
                    <h3>{t('Whitelist_check_title')}</h3>
                    <input type="text" placeholder={t('Whitelist_check_hint')} value={content} onChange={e=> setContent(e.target.value)}/>
                    <span>{t('Whitelist_check_hint2')}</span>
                    <div className='whiteButton'>
                        <button onClick={e => {
                            if (props.onClick) {
                                props.onClick(content);
                            }
                        }}>{t('Whitelist_check_button')}</button>
                    </div>
                </div>
            </Dialog>
        </div>
    )
};

export default WhiteList;

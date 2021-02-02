import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Dialog from '@material-ui/core/Dialog';
import './white.scss'
const WhiteList = (props) => {
    const { t } = useTranslation();

    const { visible, title} = props;
    const [checked, setChecked] = useState(0);

  return (
      <div>
            <Dialog onClose={props.onClose} visible={true} title={title} open={visible} className="whiteList">
                <div className="whiteListModal" visible={true}>
                    <h3>白名单校验</h3>
                    <input type="text" placeholder='请输入您的Telegram ID'/>
                    <span>例：@teemofinance</span>
                    <div className='whiteButton'>
                        <button>校验</button>
                    </div>
                </div>
            </Dialog>
      </div>

  )
};

export default WhiteList;

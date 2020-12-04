import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import LanguageIcon from '@material-ui/icons/Language';
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import SwapVertIcon from '@material-ui/icons/SwapVert';
import NotificationsIcon from '@material-ui/icons/Notifications';
import NativeSelect from '@material-ui/core/NativeSelect';
import OwnInput from '../../components/form/OwnInput';
import './userSetting.scss';

const UserSetting = () => {
  const { t } = useTranslation();
  const [ud, setUd] = useState(1);
  const [lang, setLang] = useState('en-US');
  const [cp, setCp] = useState(1);

  const [age, setAge] = useState('');
  const handleChange = (event) => {
    setAge(event.target.value);
  };

  return (
    <div className="user-setting">
      <div className="title">{t('menuPersonSetting')}</div>
      <ul className="action-list">
        <li className="item">
          <label htmlFor="">
            <LanguageIcon />
            {t('language')}
          </label>
          <NativeSelect
            value={lang}
            onChange={(e) => {
              setLang(e.target.value);
            }}
            input={<OwnInput />}
          >
            <option value="en-US">English</option>
            <option value="zh-CN">中文简体</option>
          </NativeSelect>
        </li>
        <li className="item">
          <label htmlFor="">
            <SwapVertIcon />
            {t('upDownColor')}
          </label>
          <NativeSelect
            value={ud}
            onChange={(e) => {
              setUd(e.target.value);
            }}
            input={<OwnInput />}
          >
            <option value={1}>{t('upDown')}</option>
            <option value={2}>{t('downUp')}</option>
          </NativeSelect>
        </li>
        <li className="item">
          <label htmlFor="">
            <AccessTimeIcon />
            {t('textTime')}
          </label>
          <NativeSelect value={age} onChange={handleChange} input={<OwnInput />}>
            <option value="">{t('localeTime')}</option>
          </NativeSelect>
        </li>
        <li className="item">
          <label htmlFor="">
            <NotificationsIcon />
            {t('textCloseConfirm')}
          </label>
          <NativeSelect
            value={cp}
            onChange={(e) => {
              setCp(e.target.value);
            }}
            input={<OwnInput />}
          >
            <option value={1}>{t('textOn')}</option>
            <option value={2}>{t('textOff')}</option>
          </NativeSelect>
        </li>
      </ul>
    </div>
  );
};

export default UserSetting;

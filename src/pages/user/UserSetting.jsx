import React, { useState } from 'react';
import LanguageIcon from '@material-ui/icons/Language';
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import SwapVertIcon from '@material-ui/icons/SwapVert';
import NotificationsIcon from '@material-ui/icons/Notifications';
import NativeSelect from '@material-ui/core/NativeSelect';
import OwnInput from '../../components/form/OwnInput';
import './userSetting.scss';

const UserSetting = () => {
  const [ud, setUd] = useState(1);
  const [lang, setLang] = useState('en-US');
  const [cp, setCp] = useState(1);

  const [age, setAge] = useState('');
  const handleChange = (event) => {
    setAge(event.target.value);
  };

  return (
    <div className="user-setting">
      <div className="title">个人设置</div>
      <ul className="action-list">
        <li className="item">
          <label htmlFor="">
            <LanguageIcon />
            语言
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
            涨跌色
          </label>
          <NativeSelect
            value={ud}
            onChange={(e) => {
              setUd(e.target.value);
            }}
            input={<OwnInput />}
          >
            <option value={1}>红涨绿跌</option>
            <option value={2}>绿涨红跌</option>
          </NativeSelect>
        </li>
        <li className="item">
          <label htmlFor="">
            <AccessTimeIcon />
            时间
          </label>
          <NativeSelect value={age} onChange={handleChange} input={<OwnInput />}>
            <option value="">本地时间</option>
          </NativeSelect>
        </li>
        <li className="item">
          <label htmlFor="">
            <NotificationsIcon />
            平仓确认
          </label>
          <NativeSelect
            value={cp}
            onChange={(e) => {
              setCp(e.target.value);
            }}
            input={<OwnInput />}
          >
            <option value={1}>开启</option>
            <option value={2}>关闭</option>
          </NativeSelect>
        </li>
      </ul>
    </div>
  );
};

export default UserSetting;

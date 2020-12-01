import React from 'react';
import { NavLink } from 'react-router-dom';
import AccountBalanceWalletIcon from '@material-ui/icons/AccountBalanceWallet';
import SettingsIcon from '@material-ui/icons/Settings';
import ListAltIcon from '@material-ui/icons/ListAlt';
import HeaderComponent from '../components/quotation/HeaderComponent';
import './user.scss';

const User = (props) => {
  return (
    <div className="account-wrap">
      <HeaderComponent></HeaderComponent>
      <div className="sidebar">
        <ul className="menu-box">
          <li className="menu-item">
            <NavLink to="/user/center">
              <AccountBalanceWalletIcon /> 总览
            </NavLink>
          </li>
          <li className="menu-item">
            <NavLink to="/user/rw-record">
              <ListAltIcon /> 历史记录
            </NavLink>
          </li>
          <li className="menu-item">
            <NavLink to="/user/setting">
              <SettingsIcon /> 设置
            </NavLink>
          </li>
        </ul>
      </div>
      <div className="content">{props.children}</div>
    </div>
  );
};

export default User;

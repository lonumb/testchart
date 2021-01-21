import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router-dom';
import AccountBalanceWalletIcon from '@material-ui/icons/AccountBalanceWallet';
import SettingsIcon from '@material-ui/icons/Settings';
import ListAltIcon from '@material-ui/icons/ListAlt';
import './user.scss';

const User = (props) => {
  const { t } = useTranslation();

  return (
    <div className="account-wrap">
      <div className="sidebar">
        <ul className="menu-box">
          {/* <li className="menu-item">
            <NavLink to="/user/center">
              <AccountBalanceWalletIcon /> {t('menuAccount')}
            </NavLink>
          </li> */}
          <li className="menu-item">
            <NavLink to="/user/rw-record">
              <ListAltIcon /> {t('menuRecord')}
            </NavLink>
          </li>
          {/* <li className="menu-item">
            <NavLink to="/user/setting">
              <SettingsIcon /> {t('menuSetting')}
            </NavLink>
          </li> */}
        </ul>
      </div>
      <div className="content">{props.children}</div>
    </div>
  );
};

export default User;

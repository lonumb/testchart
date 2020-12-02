import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
// import Notifications from '@material-ui/icons/Notifications';
import ArrowDropDownRoundedIcon from '@material-ui/icons/ArrowDropDownRounded';
import AccountBalanceWalletIcon from '@material-ui/icons/AccountBalanceWallet';
import ExpandMoreRoundedIcon from '@material-ui/icons/ExpandMoreRounded';
import SettingsIcon from '@material-ui/icons/Settings';
import StorageIcon from '@material-ui/icons/Storage';
import ListAltIcon from '@material-ui/icons/ListAlt';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import CheckCircleOutline from '@material-ui/icons/CheckCircleOutline';
import OwnPopover from '../popover/OwnPopover';
import { usePopupState, bindToggle, bindPopover } from 'material-ui-popup-state/hooks';
import { NavLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import * as Types from '../../store/types';
import { useWeb3React } from '@web3-react/core';
import { walletconnect } from '../wallet/Connectors';
import { NETWORK_LIST, NETWORK_TYPE } from '../../utils/Constants';

import WithdrawModal from '../account/Withdraw';
import RechargeModal from '../account/Recharge';
import ConnectModal from '../wallet/Connect';
import './header.scss';

const HeaderComponent = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const withdrawVisible = useSelector((state) => state.common.withdraw.visible);
  const rechargeVisible = useSelector((state) => state.common.recharge.visible);

  const context = useWeb3React();
  const { active, account, library, connector, deactivate, chainId } = context;

  const popupStateLang = usePopupState({ variant: 'popover', popupId: 'langPopover' });
  const popupStateWallet = usePopupState({ variant: 'popover', popupId: 'walletPopover' });
  const popupStateOrder = usePopupState({ variant: 'popover', popupId: 'orderPopover' });

  const [network, setNetwork] = useState(false);
  useEffect(() => {
    if (NETWORK_TYPE === 'prod') {
      if (!chainId || chainId === 1) {
        setNetwork(false);
      } else {
        // 显示网络错误
        setNetwork(true);
      }
    } else if (NETWORK_TYPE === 'dev') {
      if (!chainId || chainId === 3) {
        setNetwork(false);
      } else {
        // 显示网络错误
        setNetwork(true);
      }
    }
  }, [active, chainId]);

  return (
    <div className="header">
      <img src="/imgs/logo.png" alt="" />
      <ul className="nav">
        <li className="item">
          <NavLink to="/trade">交易</NavLink>
        </li>
        <li className="item">
          <NavLink to="/pool/info">流动池</NavLink>
        </li>
        <li className="item">
          <NavLink
            to="/user/center"
            isActive={(match, location) => {
              return location.pathname ? location.pathname.indexOf('/user') !== -1 : false;
            }}
          >
            账户
          </NavLink>
        </li>
        <li className="item">
          <a href="">公示</a>
        </li>
        <li className="item">
          <a href="">
            更多 <ExpandMoreRoundedIcon />
          </a>
        </li>
      </ul>
      {/* <div className="news">
        <Notifications />
      </div> */}
      {active && (
        <div className="order-status" {...bindToggle(popupStateOrder)}>
          1 Pending...
          <OwnPopover {...bindPopover(popupStateOrder)} anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }} transformOrigin={{ vertical: 'top', horizontal: 'left' }}>
            <ul className="order-status-list">
              <li className="title">
                <span>最近7笔交易</span>
                <span>清空</span>
              </li>
              <li className="item">
                <span>USDT/ETH 建仓</span>
                <span>
                  <CheckCircleOutline />
                </span>
              </li>
              <li className="item">
                <span>充值 11938.002912 USDT</span>
                <span>
                  <CheckCircleOutline />
                </span>
              </li>
              <li className="no-data">暂无交易记录</li>
            </ul>
          </OwnPopover>
        </div>
      )}

      <div className="language" {...bindToggle(popupStateLang)}>
        English <ExpandMoreRoundedIcon />
        <OwnPopover {...bindPopover(popupStateLang)} anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }} transformOrigin={{ vertical: 'top', horizontal: 'left' }}>
          <ul className="lang-list">
            <li className="active">English</li>
            <li onClick={() => console.log('简体中文')}>简体中文</li>
          </ul>
        </OwnPopover>
      </div>

      {active ? (
        <div className="wallet" {...bindToggle(popupStateWallet)}>
          <img src={`/imgs/wallet/${library.connection.url}.png`} width="20" alt="" />
          <span className="addr">{`${account.substring(0, 6)}…${account.substring(account.length, account.length - 4)}`}</span>
          {!network ? <span className="network">{NETWORK_LIST[chainId]}</span> : <span className="network error">Wrong Network</span>}

          <ArrowDropDownRoundedIcon style={{ fontSize: 32, margin: '0 -6px 0 -5px' }} />
        </div>
      ) : (
        <button className="btn-primary" onClick={() => dispatch({ type: Types.WALLET_VISIBLE, payload: { visible: true } })}>
          连接钱包
        </button>
      )}
      <OwnPopover {...bindPopover(popupStateWallet)} anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }} transformOrigin={{ vertical: 'top', horizontal: 'left' }}>
        <div className="wallet-popover">
          <div className="recharge-box line">
            <button className="btn-primary" onClick={() => dispatch({ type: Types.RECHARGE_VISIBLE, payload: { visible: !rechargeVisible } })}>
              充值(Layer2)
            </button>
            <button className="btn-default" onClick={() => dispatch({ type: Types.WITHDRAW_VISIBLE, payload: { visible: !withdrawVisible } })}>
              提现
            </button>
          </div>
          <ul className="wallet-menu-list">
            <li onClick={() => history.push('/user/rw-record')}>
              <ListAltIcon />
              交易记录
            </li>
            <li onClick={() => history.push('/user/center')}>
              <AccountBalanceWalletIcon />
              钱包详情
            </li>
            <li className="line" onClick={() => history.push('/user/setting')}>
              <SettingsIcon />
              个人设置
            </li>
            <li>
              <FileCopyIcon />
              复制地址
            </li>
            <li>
              <StorageIcon />
              在Etherscan中查看
            </li>
          </ul>
          <div className="btn-box">
            <button
              onClick={() => {
                try {
                  if (connector === walletconnect) {
                    connector.close();
                  } else {
                    deactivate();
                  }
                } catch (error) {}
              }}
            >
              断开钱包
            </button>
          </div>
        </div>
      </OwnPopover>

      <WithdrawModal></WithdrawModal>
      <RechargeModal></RechargeModal>
      <ConnectModal></ConnectModal>
    </div>
  );
};

export default HeaderComponent;

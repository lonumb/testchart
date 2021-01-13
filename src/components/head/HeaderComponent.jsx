import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import ArrowDropDownRoundedIcon from '@material-ui/icons/ArrowDropDownRounded';
import AccountBalanceWalletIcon from '@material-ui/icons/AccountBalanceWallet';
import ExpandMoreRoundedIcon from '@material-ui/icons/ExpandMoreRounded';
import SettingsIcon from '@material-ui/icons/Settings';
import StorageIcon from '@material-ui/icons/Storage';
import ListAltIcon from '@material-ui/icons/ListAlt';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import CheckCircleOutline from '@material-ui/icons/CheckCircleOutline';
import { useWeb3React } from '@web3-react/core';
import { usePopupState, bindToggle, bindPopover, bindHover } from 'material-ui-popup-state/hooks';
import { NavLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { actionRechargeModal, actionWithdrawModal, actionWalletModal } from '../../store/actions/CommonAction';
import { walletconnect } from '../wallet/Connectors';
import config, { chainConfig } from '../../components/wallet/Config'

import OwnPopover from '../popover/OwnPopover';
import WithdrawModal from '../account/Withdraw';
import RechargeModal from '../account/Recharge';
import ConnectModal from '../wallet/Connect';
import './header.scss';

const HeaderComponent = () => {
  const { t } = useTranslation();
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

  // 复制地址
  function copyAddrFunc() {
    window.navigator.clipboard.writeText(account).then(
      () => {
        console.log('success');
      },
      (err) => console.log('fail')
    );
  }

  useEffect(() => {
    if (config.supportedChainIds.indexOf(chainId) != -1) {
      setNetwork(false);
    } else {
      // 显示网络错误
      setNetwork(true);
    }
  }, [active, chainId]);

  return (
    <div className="header">
      <img src="/imgs/logo.png" alt="" />
      <ul className="nav">
        <li className="item">
          <NavLink to="/trade">{t('navTrade')}</NavLink>
        </li>
        <li className="item">
          <NavLink to="/pool/info">{t('navPool')}</NavLink>
        </li>
        <li className="item">
          <NavLink
            to="/user/center"
            isActive={(match, location) => {
              return location.pathname ? location.pathname.indexOf('/user') !== -1 : false;
            }}
          >
            {t('navAccount')}
          </NavLink>
        </li>
        <li className="item">
          <a href="">{t('navPublic')}</a>
        </li>
        <li className="item">
          <a href="">
            {t('navMore')} <ExpandMoreRoundedIcon />
          </a>
        </li>
      </ul>
      {/* <div className="news">
        <Notifications />
      </div> */}
      {active && (
        <div className="order-status" {...bindToggle(popupStateOrder)} {...bindHover(popupStateOrder)}>
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

      <div className="language" {...bindToggle(popupStateLang)} {...bindHover(popupStateLang)}>
        English <ExpandMoreRoundedIcon />
        <OwnPopover {...bindPopover(popupStateLang)} anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }} transformOrigin={{ vertical: 'top', horizontal: 'left' }}>
          <ul className="lang-list">
            <li className="active">English</li>
            <li onClick={() => console.log('简体中文')}>简体中文</li>
          </ul>
        </OwnPopover>
      </div>

      {active ? (
        <React.Fragment>
          <div className="wallet" {...bindToggle(popupStateWallet)} {...bindHover(popupStateWallet)}>
            <img src={`/imgs/wallet/${library.connection.url}.png`} width="20" alt="" />
            <span className="addr">{`${account.substring(0, 6)}…${account.substring(account.length, account.length - 4)}`}</span>
            {!network ? <span className="network">{chainConfig[chainId].networkName}</span> : <span className="network error">Wrong Network</span>}

            <ArrowDropDownRoundedIcon style={{ fontSize: 32, margin: '0 -6px 0 -5px' }} />
          </div>
          <OwnPopover {...bindPopover(popupStateWallet)} anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }} transformOrigin={{ vertical: 'top', horizontal: 'left' }}>
            <div className="wallet-popover">
              <div className="recharge-box line">
                <button className="btn-primary" onClick={() => actionRechargeModal(!rechargeVisible)(dispatch)}>
                  {t('textRecharge')}(Layer2)
                </button>
                <button className="btn-default" onClick={() => actionWithdrawModal(!withdrawVisible)(dispatch)}>
                  {t('textWithdraw')}
                </button>
              </div>
              <ul className="wallet-menu-list">
                <li onClick={() => history.push('/user/rw-record')}>
                  <ListAltIcon />
                  {t('menuTradeRecord')}
                </li>
                <li onClick={() => history.push('/user/center')}>
                  <AccountBalanceWalletIcon />
                  {t('menuWalletDetail')}
                </li>
                <li className="line" onClick={() => history.push('/user/setting')}>
                  <SettingsIcon />
                  {t('menuPersonSetting')}
                </li>
                <li onClick={() => copyAddrFunc()}>
                  <FileCopyIcon />
                  {t('copyAddress')}
                </li>
                <li>
                  <a href={`https://etherscan.io/address/${account}`} target="_blank" rel="noopener noreferrer">
                    <StorageIcon />
                    {t('menuAddressDetail')}
                  </a>
                </li>
              </ul>
              <div className="btn-box">
                <button
                  onClick={() => {
                    popupStateWallet.close();
                    try {
                      if (connector === walletconnect) {
                        connector.close();
                      } else {
                        deactivate();
                      }
                    } catch (error) {}
                  }}
                >
                  {t('walletQuit')}
                </button>
              </div>
            </div>
          </OwnPopover>
        </React.Fragment>
      ) : (
        <button className="btn-primary" onClick={() => actionWalletModal(true)(dispatch)}>
          {t('walletConnect')}
        </button>
      )}

      <WithdrawModal></WithdrawModal>
      <RechargeModal></RechargeModal>
      <ConnectModal></ConnectModal>
    </div>
  );
};

export default HeaderComponent;

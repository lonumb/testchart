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
import { injected, walletconnect } from '../wallet/Connectors';
import { supportedChainIds, chainConfig, isSupportedChainId, ensumeChainId } from '../../components/wallet/Config'
import { langList, getLang, switchLang } from '../../i18n/LangUtil';
import * as HttpUtil from '../../utils/HttpUtil';

import OwnPopover from '../popover/OwnPopover';
import WithdrawModal from '../account/Withdraw';
import RechargeModal from '../account/Recharge';
import ConnectModal from '../wallet/Connect';
import SureModal from '../modal/sureModal';
import Notice from '../modal/Notice';
import WhiteList from '../modal/whiteList';
import './header.scss';
import { actionTradeHistoryList } from '../../store/actions/TradeAction'
import CircularProgress from '@material-ui/core/CircularProgress';

const HeaderComponent = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const history = useHistory();
  const withdrawVisible = useSelector((state) => state.common.withdraw.visible);
  const rechargeVisible = useSelector((state) => state.common.recharge.visible);

  const context = useWeb3React();
  const { active, account, library, connector, deactivate, chainId } = context;
  const { tradeHistoryList } = useSelector((state) => state.trade);

  const popupStateLang = usePopupState({ variant: 'popover', popupId: 'langPopover' });
  const popupStateWallet = usePopupState({ variant: 'popover', popupId: 'walletPopover' });
  const popupStateOrder = usePopupState({ variant: 'popover', popupId: 'orderPopover' });

  const [network, setNetwork] = useState(false);
  const [lang, setLang] = useState('en-US');
  const [noticeVisible, setNoticeVisible] = useState(null);
  //const [pendingCount, setPendingCount] = useState(0);
  const [whiteListVisible, setWhiteListVisible] = useState(null);

  // 复制地址
  function copyAddrFunc() {
    window.navigator.clipboard.writeText(account).then(
      () => {
        console.log('success');
        alert(t('Copy_success'));
      },
      (err) => console.log('fail')
    );
  }

  useEffect(() => {
    // var content = localStorage.getItem('white_list_content');
    // setWhiteListVisible(!content);
  }, []);

  useEffect(() => {
    if (whiteListVisible == false) {
      setNoticeVisible(!(localStorage.getItem('hide_notice_modal') || false));
    }
  }, [whiteListVisible]);

  useEffect(() => {
    if (supportedChainIds.indexOf(chainId) != -1) {
      setNetwork(false);
    } else {
      // 显示网络错误
      setNetwork(true);
    }
  }, [active, chainId]);

  useEffect(() => {
    setLang(getLang());
  }, []);

  // useEffect(() => {
  //   var list = tradeHistoryList.filter((item) => item.pending);
  //   alert(list.length);
  //   setPendingCount(list.length);
  // }, [tradeHistoryList]);

  const getConnectionUrl = (library) => {
    if (connector === injected && window.ethereum && window.ethereum.isMathWallet) {
      return 'mathWallet';
    }
    return library.connection.url;
  };

  const onLangClick = (lang) => {
    setLang(lang);
    switchLang(lang);
  };

  const onWhiteListContentChanged = (content) => {
    if (!content) return;
    HttpUtil.URLENCODED_GET('/api/order/querywhitelist.do', {chainId, type: 'telegram', info: content}).then((res) => {
      console.log(res);
      if (res.success) {
        setWhiteListVisible(false);
        localStorage.setItem('hide_white_list_modal', true);
        localStorage.setItem('white_list_content', content);
      } else {
        alert(t('Whitelist_check_failed'));
      }
    }).catch((e) => {
      console.log(e);
      alert(t('NetworkErr'));
    });
  };

  const openExplorer = (hash) => {
    window.open(`${chainConfig[ensumeChainId(chainId)].explorerUrl}/tx/${hash}`);
  };

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
            to="/user/integral"
            isActive={(match, location) => {
              return location.pathname ? location.pathname.indexOf('/user') !== -1 : false;
            }}
          >
            {t('navAccount')}
          </NavLink>
        </li>
        <li className="item">
          <a href="https://help.teemo.finance/" className='noColor' target="_blank">{t('Help_big_title')}</a>
        </li>
        {/* <li className="item">
          <a href="">{t('navPublic')}</a>
        </li>
        <li className="item">
          <a href="">
            {t('navMore')} <ExpandMoreRoundedIcon />
          </a>
        </li> */}
      </ul>
      {/* <div className="news">
        <Notifications />
      </div> */}
      
      {active && tradeHistoryList && tradeHistoryList.filter((item) => item.pending).length > 0 && (
        <div className="order-status" {...bindToggle(popupStateOrder)} {...bindHover(popupStateOrder)}>
          {tradeHistoryList.filter((item) => item.pending).length} Pending...
          <OwnPopover {...bindPopover(popupStateOrder)} anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }} transformOrigin={{ vertical: 'top', horizontal: 'left' }}>
            <ul className="order-status-list">
              <li className="title">
                <span>{t('Last_seven_trade', {p : tradeHistoryList.filter((item) => item.pending).length})}</span>
                <span onClick={e=> actionTradeHistoryList([])(dispatch)}>{t('Claer')}</span>
              </li>

              {tradeHistoryList.map((item, index) => {
                if (item.type == 'open_market_swap' || item.type == 'open_limit_swap') {
                  return (
                    <li className="item" onClick={e=> openExplorer(item.hash)}>
                      <span>{item.symbol.toUpperCase()} {t('textBuild')}</span>
                      <span>
                        {!item.pending ? <CircularProgress /> : <CheckCircleOutline />}
                      </span>
                    </li>
                  );
                }
                if (item.type == 'close_order') {
                  return (
                    <li className="item" onClick={e=> openExplorer(item.hash)}>
                      <span>{item.symbol.toUpperCase()} {t('textClose')}</span>
                      <span>
                        {item.pending ? <CircularProgress /> : <CheckCircleOutline />}
                      </span>
                    </li>
                  );
                }
                if (item.type == 'approve') {
                  return (
                    <li className="item" onClick={e=> openExplorer(item.hash)}>
                      <span>{item.symbol.toUpperCase()} {t('btnAuth')}</span>
                      <span>
                        {item.pending ? <CircularProgress /> : <CheckCircleOutline />}
                      </span>
                    </li>
                  );
                }
                return (<div></div>);
              })}

              {/* <li className="item">
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
              </li> */}
              {tradeHistoryList.length == 0 && <li className="no-data">{t('no_record')}</li>}
            </ul>
          </OwnPopover>
        </div>
      )}

      <div className="language" {...bindToggle(popupStateLang)} {...bindHover(popupStateLang)}>
        {langList[lang].t} <ExpandMoreRoundedIcon />
        <OwnPopover {...bindPopover(popupStateLang)} anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }} transformOrigin={{ vertical: 'top', horizontal: 'left' }}>
          <ul className="lang-list">
            {Object.keys(langList).map((item) => {
                return (
                  <li className={lang == item ? 'active' : ''} onClick={() => onLangClick(item)} key={item}>
                    {langList[item].t}
                  </li>
                );
            })}
          </ul>
        </OwnPopover>
      </div>

      {active ? (
        <React.Fragment>
          <div className="wallet" {...bindToggle(popupStateWallet)} {...bindHover(popupStateWallet)}>
            <img src={`/imgs/wallet/${getConnectionUrl(library)}.png`} width="20" alt="" />
            <span className="addr">{`${account.substring(0, 6)}…${account.substring(account.length, account.length - 4)}`}</span>
            {isSupportedChainId(chainId) ? <span className="network">{chainConfig[chainId].networkName}</span> : <span className="network error">Wrong Network</span>}

            <ArrowDropDownRoundedIcon style={{ fontSize: 32, margin: '0 -6px 0 -5px' }} />
          </div>
          <OwnPopover {...bindPopover(popupStateWallet)} anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }} transformOrigin={{ vertical: 'top', horizontal: 'left' }}>
            <div className="wallet-popover">
              {/* <div className="recharge-box line">
                <button className="btn-primary" onClick={() => actionRechargeModal(!rechargeVisible)(dispatch)}>
                  {t('textRecharge')}(Layer2)
                </button>
                <button className="btn-default" onClick={() => actionWithdrawModal(!withdrawVisible)(dispatch)}>
                  {t('textWithdraw')}
                </button>
              </div> */}
              <ul className="wallet-menu-list">
                <li onClick={() => history.push('/user/rw-record')}>
                  <ListAltIcon />
                  {t('menuTradeRecord')}
                </li>
                {/* <li onClick={() => history.push('/user/center')}>
                  <AccountBalanceWalletIcon />
                  {t('menuWalletDetail')}
                </li>
                <li className="line" onClick={() => history.push('/user/setting')}>
                  <SettingsIcon />
                  {t('menuPersonSetting')}
                </li> */}
                <li onClick={() => copyAddrFunc()}>
                  <FileCopyIcon />
                  {t('copyAddress')}
                </li>
                <li>
                  <a href={`${chainConfig[ensumeChainId(chainId)].explorerUrl}/address/${account}`} target="_blank" rel="noopener noreferrer">
                    <StorageIcon />
                    {t('menuAddressDetail', { name: chainConfig[ensumeChainId(chainId)].explorerName})}
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
      <SureModal></SureModal>
      <Notice visible={noticeVisible} onClick={checked => {
        if (checked) {
          localStorage.setItem('hide_notice_modal', true);
        }
        setNoticeVisible(false);
      }}></Notice>
      <WhiteList visible={whiteListVisible} onClick={content=> onWhiteListContentChanged(content)}></WhiteList>
    </div>
  );
};

export default HeaderComponent;

import React, { useEffect, useState } from 'react';
import { useWeb3React } from '@web3-react/core';
import Web3 from 'web3';
import { useSelector, useDispatch } from 'react-redux';
import { injected, walletconnect, walletlinkconnect, bsc, isBscSupported, isWalletlinkSupported } from './Connectors';
import { useEagerConnect, useInactiveListener } from '../../hooks/Wallet';
import Modal from '../modal/OwnDialog';
import * as Types from '../../store/types';
import './connect.scss';

const WalletConnectModal = () => {
  const dispatch = useDispatch();
  const { library, connector, activate } = useWeb3React();
  const [activatingConnector, setActivatingConnector] = useState();
  const { visible } = useSelector((state) => state.common.wallet);
  const [mm, setMm] = useState(false);

  useEffect(() => {
    if (activatingConnector && activatingConnector === connector) {
      setActivatingConnector(undefined);
    }
  }, [activatingConnector, connector]);

  // 默认不连接
  // handle logic to eagerly connect to the injected ethereum provider, if it exists and has granted access already
  const triedEager = useEagerConnect();
  // handle logic to connect in reaction to certain events on the injected ethereum provider, if it exists
  useInactiveListener(!triedEager || !!activatingConnector);

  function changeWallet(c) {
    setActivatingConnector(c);
    activate(c);
    dispatch({ type: Types.WALLET_VISIBLE, payload: { visible: false } });
  }

  return (
    <div>
      <Modal visible={visible} onClose={() => dispatch({ type: Types.WALLET_VISIBLE, payload: { visible: !visible } })} title="选择钱包供应商" maxWidth="md">
        <div className="wallet-connect">
          <ul>
          <li
              className={!!(connector === injected) ? 'active' : ''}
              onClick={() => {
                if (!window.ethereum) {
                  setMm(true);
                } else {
                  changeWallet(injected);
                }
              }}
            >
              {mm ? <a href="https://metamask.io/">Install MetaMask</a> : <span>MetaMask</span>}
              <img src="/imgs/wallet/metamask.png" />
            </li>
            <li
              className={!!(connector === injected) ? 'active' : ''}
              onClick={() => {
                if (!window.ethereum) {
                  setMm(true);
                } else {
                  changeWallet(injected);
                }
              }}
            >
              {mm ? <a href="https://mathwallet.org/">Install MathWallet</a> : <span>MathWallet</span>}
              <img src="/imgs/wallet/mathWallet.png" />
            </li>
            <li className={!!(connector === walletconnect) ? 'active' : ''} onClick={() => changeWallet(walletconnect)}>
              <span>WalletConnet</span>
              <img src="/imgs/wallet/walletconnet.png" />
            </li>
            
            { isWalletlinkSupported() && <li className={!!(connector === walletlinkconnect) ? 'active' : ''} onClick={() => changeWallet(walletlinkconnect)}>
              <span>Coinbase Wallet</span>
              <img src="/imgs/wallet/coinbaseWalletIcon.svg"/>
            </li>}
            
            { isBscSupported() && <li
              className={!!(connector === bsc) ? 'active' : ''}
              onClick={async () => {
                if (window.BinanceChain) {
                  changeWallet(bsc);
                } else {
                  setMm(true);
                }
              }}
            >
              {mm ? <a href="https://www.binance.org/">Install Binance Chain Wallet</a> : <span>Binance Chain Wallet</span>}

              <img src="/imgs/wallet/binance.png" />
            </li> }
          </ul>
        </div>
      </Modal>
    </div>
  );
};

export default WalletConnectModal;

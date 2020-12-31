import { InjectedConnector } from '@web3-react/injected-connector'
import { NetworkConnector } from '@web3-react/network-connector'
import { WalletConnectConnector } from '@web3-react/walletconnect-connector'
import { WalletLinkConnector } from '@web3-react/walletlink-connector'
import { BscConnector } from '@binance-chain/bsc-connector'

import chainConfig from './Config'


export const isInjectedSupported = () => {
  return chainConfig.supportedChainIds.length > 0;
}

export const isNetworkConnectorSupported = () => {
  return true;
}

export const isWalletconnectSupported = () => {
  return true;
}

export const isWalletlinkSupported = () => {
  return true;
}

export const isBscSupported = () => {
  return chainConfig.supportedChainIds.filter((item) => item == 56 || item == 97).length > 0;
}

export const injected = new InjectedConnector({ supportedChainIds: chainConfig.supportedChainIds });

export const network = new NetworkConnector({
  urls: chainConfig.rpcUrls,
  defaultChainId: chainConfig.defaultChainId,
})

export const walletconnect = new WalletConnectConnector({
  rpc: { [chainConfig.defaultChainId]: [chainConfig.getChainConfig(chainConfig.defaultChainId).rpcUrl] },
  bridge: 'https://bridge.walletconnect.org',
  qrcode: true,
  pollingInterval: 15000,
});

export const walletlinkconnect = new WalletLinkConnector({
  appName: window.location.protocol + "//" + window.location.host + (window.location.port.length > 0 ? `:${window.location.port}` : ''),
  url: chainConfig.getChainConfig(chainConfig.defaultChainId).rpcUrl,
})

export const bsc = new BscConnector({
  supportedChainIds: chainConfig.supportedChainIds.filter((item) => item == 56 || item == 97)
})

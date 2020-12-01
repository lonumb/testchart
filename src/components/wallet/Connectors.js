import { InjectedConnector } from '@web3-react/injected-connector';
import { NetworkConnector } from '@web3-react/network-connector';
import { WalletConnectConnector } from '@web3-react/walletconnect-connector';

const POLLING_INTERVAL = 12000;
const RPC_URLS = {
  1: process.env.REACT_APP_RPC_URL_1,
  3: process.env.REACT_APP_RPC_URL_3,
  4: process.env.REACT_APP_RPC_URL_4,
  5: process.env.REACT_APP_RPC_URL_5,
  42: process.env.REACT_APP_RPC_URL_42,
};

// https://infura.io/dashboard/ethereum/e9acee51d9044305865a135e4bbdcb3d/settings
// 1: Mainnet 3:Ropsten 4:Rinkeby 5:goerli 42:testnet Kovan
export const injected = new InjectedConnector({ supportedChainIds: [1, 3, 4, 5, 42] });

export const network = new NetworkConnector({
  urls: { 1: RPC_URLS[1], 3: RPC_URLS[3], 4: RPC_URLS[4], 5: RPC_URLS[5], 42: RPC_URLS[42] },
  defaultChainId: 1,
});

export const walletconnect = new WalletConnectConnector({
  // rpc: { 1: RPC_URLS[1] },
  rpc: { [process.env.REACT_APP_RPC_URL_KEY]: RPC_URLS[process.env.REACT_APP_RPC_URL_KEY] },
  bridge: 'https://bridge.walletconnect.org',
  qrcode: true,
  pollingInterval: POLLING_INTERVAL,
});

import { chainConfig, ensumeChainId } from '../components/wallet/Config'

export const config = {
    56 : {
        quoteFactoryContractAddress: '0xB861098F092244A0a0Aaf8b1d7CcaD703Dbe45D4',
        poolFactoryContractAddress: '0xcF7a5DCd94c8d8f1Dfc353D1FF3016DDb9335BC7',
        poolProxyContractAddress: '0xb687494958E24745F8F4198ffEcD035837fc2031',
        bonusRecordContractAddress: '0xa30cc0b794Fc8137A8a9191E97A62C4f8120469d',
        baseUrl: 'https://mvp.teemo.finance',
        quoteWS: 'wss://mvp.teemo.finance/ws',
    },
    97: {
        quoteFactoryContractAddress: '0x38c3e24C8ccd36080F7e29FEF9EF8eF26952ffFA',
        poolFactoryContractAddress: '0x173D36f41e845cA9eFd8d48691b2dFEC6b5C739d',
        poolProxyContractAddress: '0x9FFA0Be2cbCEe3d19eB7DC7e90D665C49622c239',
        bonusRecordContractAddress: '0x7c7bA4fEaDe71abdDA26DC10e4707928f4CCb2C5',
        baseUrl: 'https://mvp.teemo.finance',
        quoteWS: 'wss://mvp.teemo.finance/ws',
    },
    1337 : {
        quoteFactoryContractAddress: '0x98DbdAFBF3cD03F2D715f79148ee43e310Dbf52C',
        poolFactoryContractAddress: '0x1f3556e55b3ebA9Eaa5b63a390204127Aa5F8856',
        poolProxyContractAddress: '0x10399743b57cb5ceb6f1f63c4CB2166B7660801C',
        bonusRecordContractAddress: '0x2f43E1d5D90c116E100aa4158B2B5214343b9a9F',
        baseUrl: 'https://mvp.teemo.finance',
        quoteWS: 'wss://mvp.teemo.finance/ws',
    },
};

export const products = [
    {
      "symbol": "BTC",
      "legalSymbol": "USDT",
      "decimal": "2",
      "pair": "btc/usdt",
    },
    {
      "symbol": "ETH",
      "legalSymbol": "USDT",
      "decimal": "2",
      "pair": "eth/usdt",
    },
    {
      "symbol": "BNB",
      "legalSymbol": "USDT",
      "decimal": "4",
      "pair": "bnb/usdt",
    },
];

export const mineEnabled = true;

export const getConfigByChainID = (chainId) => {
    return Object.assign({}, config[chainId], chainConfig[chainId]);
};

export const getEnsumeConfigByChainID = (chainId) => {
    return Object.assign({}, config[ensumeChainId(chainId)], chainConfig[ensumeChainId(chainId)]);
};

export default config;
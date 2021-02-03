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
        quoteFactoryContractAddress: '0x3C39f0777a09e0882B6A1D230BAf3eA198e27FeF',
        poolFactoryContractAddress: '0xDB86c226D57e15bCE76C857FdA4e80D1CF81A9BD',
        poolProxyContractAddress: '0x2f146293542E194a733E4b847bccffc43e3Cdc43',
        bonusRecordContractAddress: '0x0B4603d121FE8490Fb3ec0Bbcf90952E8523EAd7',
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
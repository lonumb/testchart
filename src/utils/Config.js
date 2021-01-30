import { chainConfig, ensumeChainId } from '../components/wallet/Config'

export const config = {
    3 : {
        quoteFactoryContractAddress: '0x6F5a802977D149714Af838259b85F6a0aE32eb09',
        poolFactoryContractAddress: '0xe62514AfAe531eaBEb00fF9a9Df651D1e650EC91',
        poolProxyContractAddress: '0xC0bee094F57B82BE8927B9bA962dA0bd3f0D38Bf',
        bonusRecordContractAddress: '0x2f43E1d5D90c116E100aa4158B2B5214343b9a9F',
        baseUrl: 'http://47.90.62.21:9003',
        quoteWS: 'ws://test.trade.idefiex.com:9002',
    },
    97: {
        quoteFactoryContractAddress: '0x6a46C7c0a8E955d7e45A327f6A918c97445b81B9',
        poolFactoryContractAddress: '0xB6007FBe5D28554c914C045F3EE8a0fd23F317A2',
        poolProxyContractAddress: '0xB28614208ea6300d8cB6d1686b0Eca00B8A4f095',
        bonusRecordContractAddress: '0xe4DF6719299b4e4bb7C3672f83933bb703564671',
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

export const getConfigByChainID = (chainId) => {
    return Object.assign({}, config[chainId], chainConfig[chainId]);
};

export const getEnsumeConfigByChainID = (chainId) => {
    return Object.assign({}, config[ensumeChainId(chainId)], chainConfig[ensumeChainId(chainId)]);
};

export default config;
import chainConfig, { ensumeChainId } from '../components/wallet/Config'

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
        quoteFactoryContractAddress: '0x3ACfFEAEaDEcB233804FCAd81c17cCeD6cd4Caf1',
        poolFactoryContractAddress: '0xB6B1C1d0FA8c2aD0083FA199b0A85a4108372dAD',
        poolProxyContractAddress: '0x33b711Eaa5Ed26110d67BE54F57A044E771D960A',
        bonusRecordContractAddress: '0x2f43E1d5D90c116E100aa4158B2B5214343b9a9F',
        baseUrl: 'https://mvp.teemo.finance',
        quoteWS: 'wss://mvp.teemo.finance/ws',
    },
    1337 : {
        quoteFactoryContractAddress: '0x98DbdAFBF3cD03F2D715f79148ee43e310Dbf52C',
        poolFactoryContractAddress: '0x1f3556e55b3ebA9Eaa5b63a390204127Aa5F8856',
        poolProxyContractAddress: '0x10399743b57cb5ceb6f1f63c4CB2166B7660801C',
        bonusRecordContractAddress: '0x2f43E1d5D90c116E100aa4158B2B5214343b9a9F',
        baseUrl: 'https://47.90.62.21',
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
    return Object.assign({}, config[chainId], chainConfig.getChainConfig(chainId));
};

export const getEnsumeConfigByChainID = (chainId) => {
    return Object.assign({}, config[ensumeChainId(chainId)], chainConfig.getChainConfig(ensumeChainId(chainId)));
};

export default config;
import chainConfig, { ensumeChainId } from '../components/wallet/Config'

export const config = {
    3 : {
        quoteFactoryContractAddress: '0x6F5a802977D149714Af838259b85F6a0aE32eb09',
        poolFactoryContractAddress: '0xe62514AfAe531eaBEb00fF9a9Df651D1e650EC91',
        poolProxyContractAddress: '0xC0bee094F57B82BE8927B9bA962dA0bd3f0D38Bf',
        baseUrl: 'http://47.90.62.21:9003',
        quoteWS: 'ws://test.trade.idefiex.com:9002',
    },
    97: {
        quoteFactoryContractAddress: '0xc43023d03b526674243cf6Da276E033723d175be',
        poolFactoryContractAddress: '0xDD266400B7500e0FF1724fEC303E3739c524EA01',
        poolProxyContractAddress: '0x22440E93b507e222bc0ae18389F469a8118B61cC',
        baseUrl: 'https://mvp.teemo.finance',
        quoteWS: 'wss://mvp.teemo.finance/ws',
    },
    1337 : {
        quoteFactoryContractAddress: '0x414e1c61B2583b3d869EB7dfE6D140cc3a3612fD',
        poolFactoryContractAddress: '0xcdF4e7C5520ac7c66E12908e0c3EC5296a64E577',
        poolProxyContractAddress: '0xd5fa99671C71857a921de730B242052D5d084700',
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
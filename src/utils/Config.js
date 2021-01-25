import chainConfig, { ensumeChainId } from '../components/wallet/Config'

export const config = {
    3 : {
        quoteContractAddress: '0x6F5a802977D149714Af838259b85F6a0aE32eb09',
        poolContractAddress: '0xe62514AfAe531eaBEb00fF9a9Df651D1e650EC91',
        poolProxyContractAddress: '0xC0bee094F57B82BE8927B9bA962dA0bd3f0D38Bf',
        baseUrl: 'http://47.90.62.21:9003',
        quoteWS: 'ws://test.trade.idefiex.com:9002',
    },
    97: {
        quoteContractAddress: '0x4eA0c536C2bbA48d5355053dFf4F6949b4C56516',
        poolContractAddress: '0xb70BdC7a05190C4aEBB8cF094Fef333c00f2ca4C',
        poolProxyContractAddress: '0xffdF2Ed5A241e55dC2C8628Fc081099ec0AE73EA',
        baseUrl: 'https://mvp.teemo.finance',
        quoteWS: 'wss://mvp.teemo.finance/ws',
    },
    1337 : {
        quoteContractAddress: '0x414e1c61B2583b3d869EB7dfE6D140cc3a3612fD',
        poolContractAddress: '0xcdF4e7C5520ac7c66E12908e0c3EC5296a64E577',
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
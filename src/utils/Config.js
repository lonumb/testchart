import chainConfig, { ensumeChainId } from '../components/wallet/Config'

const config = {
    3 : {
        quoteContractAddress: '0x6F5a802977D149714Af838259b85F6a0aE32eb09',
        poolContractAddress: '0xe62514AfAe531eaBEb00fF9a9Df651D1e650EC91',
        poolProxyContractAddress: '0xC0bee094F57B82BE8927B9bA962dA0bd3f0D38Bf',
        baseUrl: 'http://47.90.62.21:9003',
        quoteWS: 'ws://test.trade.idefiex.com:9002',
    },
    97: {
        quoteContractAddress: '0x4BbBda0d4CB4F4136167a93C73Ff2FeB6523eA88',
        poolContractAddress: '0xae16297C50c4B9fa80cE98F48Ca7Ea5166147FF9',
        poolProxyContractAddress: '0xEA9f06d27CB9Cc440DC5AF6F22bb54EcCd62C9B0',
        baseUrl: 'http://47.90.62.21:9003',
        quoteWS: 'ws://test.trade.idefiex.com:9002',
    },
    1337 : {
        quoteContractAddress: '0x0f093fB9f50206742B9a242609D90B909f0EA12F',
        poolContractAddress: '0xacC6Ad29D0eE3Ac5EAFACA5EC97E3182e2d7dFB2',
        poolProxyContractAddress: '0x8B118F1daefF0Adcf42A5B5F9386719d03138828',
        baseUrl: 'http://47.90.62.21:9003',
        quoteWS: 'ws://test.trade.idefiex.com:9002',
    },
}

export const getConfigByChainID = (chainId) => {
    return Object.assign({}, config[chainId], chainConfig.getChainConfig(chainId));
}

export const getEnsumeConfigByChainID = (chainId) => {
    return Object.assign({}, config[ensumeChainId(chainId)], chainConfig.getChainConfig(ensumeChainId(chainId)));
}

export default config;
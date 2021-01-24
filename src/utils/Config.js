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
        quoteContractAddress: '0x4085D008b38582dc1f90Fddb6EC67Adb79490451',
        poolContractAddress: '0xaa17Dba2954c74Fc64cCC861c7Aa386Bc795A74e',
        poolProxyContractAddress: '0xD5af7503a4a2EE24E47E0Af7486f4f6c94563e2b',
        baseUrl: 'https://mvp.teemo.finance',
        quoteWS: 'wss://mvp.teemo.finance/ws',
    },
    1337 : {
        quoteContractAddress: '0x7dC6A8603bA9024A6fC1AC8999eb0eb34b264dbA',
        poolContractAddress: '0x71Fd0ECbC45Bc85B1b210f4a0266C9b3495D2eFC',
        poolProxyContractAddress: '0x7DD224e00207b5350f52a14b61b15693a3733CDf',
        baseUrl: 'https://47.90.62.21',
        quoteWS: 'wss://mvp.teemo.finance/ws',
    },
}

export const getConfigByChainID = (chainId) => {
    return Object.assign({}, config[chainId], chainConfig.getChainConfig(chainId));
}

export const getEnsumeConfigByChainID = (chainId) => {
    return Object.assign({}, config[ensumeChainId(chainId)], chainConfig.getChainConfig(ensumeChainId(chainId)));
}

export default config;
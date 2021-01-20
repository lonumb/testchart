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
        quoteContractAddress: '0x8Bb29744c56D11E877893B5004f6ee142D913328',
        poolContractAddress: '0x379367Bb08c226685df883a56BE7CE7a7A80ffB9',
        poolProxyContractAddress: '0x647804C55c434DF3EcAA83ae9Dc9ecF2774b900b',

        baseUrl: 'http://47.90.62.21:9003',
        quoteWS: 'ws://test.trade.idefiex.com:9002',
    },
    1337 : {
        quoteContractAddress: '0x61fdC4B0ed03515Fc953c1E362b84eA161548a38',
        poolContractAddress: '0x3d24fAa2BD2AC3b8EED6479a1FBde4F54B19E6Cd',
        poolProxyContractAddress: '0x3a4bC34865d326f0b1C7155c214FB27A8733455D',
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
import chainConfig from '../components/wallet/Config'

const config = {
    3 : {
        quoteContractAddress: '0x6F5a802977D149714Af838259b85F6a0aE32eb09',
        poolContractAddress: '0xe62514AfAe531eaBEb00fF9a9Df651D1e650EC91',
        poolProxyContractAddress: '0xC0bee094F57B82BE8927B9bA962dA0bd3f0D38Bf',

        teemoContractAddress: '0xf026Cd01c956B6944EC5876c4b4ba13027769F8e',
        usdtContractAddress: '0xcf032413529a3814d7277d1Afb540747e71B364d',
        baseUrl: '',
    },
    1337 : {
        quoteContractAddress: '0xDf716214c7bC8F3eeb38793419130173243c961B',
        poolContractAddress: '0xE03163f48f57e2e296714eF5EB7Ab4747Bd67539',
        poolProxyContractAddress: '0xb7AbAF0e2e557314395284eBD8B8330B5DdDa9d5',

        teemoContractAddress: '0x29D8D3ED32cB18e236F563cf806B8d5cE597b685',
        usdtContractAddress: '0x424A9EA15180bc5d746Eb4b81d3Cf9D7A1A0586E',
        baseUrl: '',
    },
}

export const getConfigByChainID = (chainId) => {
    return Object.assign({}, config[chainId], chainConfig.getChainConfig(chainId));
}

export default config;
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
        quoteContractAddress: '0x61fdC4B0ed03515Fc953c1E362b84eA161548a38',
        poolContractAddress: '0x3d24fAa2BD2AC3b8EED6479a1FBde4F54B19E6Cd',
        poolProxyContractAddress: '0x3a4bC34865d326f0b1C7155c214FB27A8733455D',

        teemoContractAddress: '0x29D8D3ED32cB18e236F563cf806B8d5cE597b685',
        usdtContractAddress: '0x424A9EA15180bc5d746Eb4b81d3Cf9D7A1A0586E',
        baseUrl: '',
    },
}

export const getConfigByChainID = (chainId) => {
    return Object.assign({}, config[chainId], chainConfig.getChainConfig(chainId));
}

export default config;
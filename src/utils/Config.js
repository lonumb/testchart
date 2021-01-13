import chainConfig from '../components/wallet/Config'

const config = {
    3 : {
        quoteContractAddress: '0x6F5a802977D149714Af838259b85F6a0aE32eb09',
        poolContractAddress: '0xe62514AfAe531eaBEb00fF9a9Df651D1e650EC91',

        teemoContractAddress: '0xf026Cd01c956B6944EC5876c4b4ba13027769F8e',
        usdtContractAddress: '0xcf032413529a3814d7277d1Afb540747e71B364d',
        baseUrl: '',
    },
    1337 : {
        quoteContractAddress: '0xEFC40424Fc2f01d0259243A5053F7963c48F454F',
        poolContractAddress: '0xf1774896801BB8AAD1db7DC32E48d9F8c174b509',
        poolProxyContractAddress: '0xC0fE3C2FC9f082F9A838ee1dA5c18f2Dab867120',

        teemoContractAddress: '0x29D8D3ED32cB18e236F563cf806B8d5cE597b685',
        usdtContractAddress: '0x424A9EA15180bc5d746Eb4b81d3Cf9D7A1A0586E',
        baseUrl: '',
    },
}

export const getConfigByChainID = (chainId) => {
    return Object.assign({}, config[chainId], chainConfig.getChainConfig(chainId));
}

export default config;